import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import {
  Order,
  OrderItem,
  OrderStatus,
  PickupType,
} from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [];

  constructor(private readonly productsService: ProductsService) {}

  createOrder(dto: CreateOrderDto): Order {
    // 1. Kiểm tra giỏ hàng không rỗng (BR-06)
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Giỏ hàng không được để trống (BR-06)');
    }

    // 2. Validate thông tin khách hàng
    if (!dto.customerName || dto.customerName.trim().length < 2) {
      throw new BadRequestException('Tên khách hàng phải có ít nhất 2 ký tự');
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!dto.customerPhone || !phoneRegex.test(dto.customerPhone.trim())) {
      throw new BadRequestException(
        'Số điện thoại không hợp lệ, phải gồm 10 chữ số bắt đầu bằng số 0'
      );
    }

    // 3. Validate hình thức nhận món (Mang đi / Dùng tại quán)
    if (
      dto.pickupType === PickupType.DINE_IN &&
      (!dto.tableNumber || !dto.tableNumber.trim())
    ) {
      throw new BadRequestException(
        'Vui lòng nhập số bàn khi chọn dùng tại quán'
      );
    }

    // 4. Kiểm tra tồn kho của toàn bộ sản phẩm trước khi tạo đơn (Atomicity)
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const itemDto of dto.items) {
      if (!itemDto.quantity || itemDto.quantity <= 0) {
        throw new BadRequestException('Số lượng mỗi món phải lớn hơn 0');
      }

      const product = this.productsService.findOne(itemDto.productId);
      if (!product) {
        throw new BadRequestException(
          `Sản phẩm với mã "${itemDto.productId}" không tồn tại`
        );
      }

      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(
          `Món "${product.name}" không đủ số lượng trong kho (còn ${product.stock}, yêu cầu ${itemDto.quantity})`
        );
      }

      const unitPrice = product.price;
      const lineTotal = Number((unitPrice * itemDto.quantity).toFixed(2));
      total = Number((total + lineTotal).toFixed(2));

      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        orderId: '',
        productId: product.id,
        productName: product.name,
        quantity: itemDto.quantity,
        size: itemDto.size || 'M',
        unitPrice,
        lineTotal,
      });
    }

    // 5. Trừ kho nguyên tử (stock decrement) trong bộ nhớ
    for (const itemDto of dto.items) {
      const product = this.productsService.findOne(itemDto.productId);
      product.stock -= itemDto.quantity;
    }

    // 6. Tạo đơn hàng mới ở trạng thái khởi tạo PENDING
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    orderItems.forEach((item) => (item.orderId = orderId));

    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      userId: dto.userId,
      customerName: dto.customerName.trim(),
      customerPhone: dto.customerPhone.trim(),
      pickupType: dto.pickupType,
      tableNumber:
        dto.pickupType === PickupType.DINE_IN
          ? dto.tableNumber?.trim()
          : undefined,
      paymentMethod: dto.paymentMethod,
      status: OrderStatus.PENDING,
      items: orderItems,
      total,
      note: dto.note?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    this.orders.push(order);
    return order;
  }

  findAll(userId?: string): Order[] {
    const filtered = userId
      ? this.orders.filter((o) => !o.userId || o.userId === userId)
      : this.orders;
    return [...filtered].sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (diff !== 0) return diff;
      return this.orders.indexOf(b) - this.orders.indexOf(a);
    });
  }

  findOne(id: string, userId?: string): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Đơn hàng với mã "${id}" không tồn tại`);
    }
    if (userId && order.userId && order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập đơn hàng này');
    }
    return order;
  }

  updateStatus(id: string, newStatus: OrderStatus, userId?: string): Order {
    const order = this.findOne(id, userId);
    this.assertTransition(order.status, newStatus);

    // Nếu đơn hàng bị hủy khi đang PENDING hoặc PREPARING -> hoàn lại tồn kho
    if (newStatus === OrderStatus.CANCELLED) {
      if (
        order.status === OrderStatus.PENDING ||
        order.status === OrderStatus.PREPARING ||
        order.status === OrderStatus.PAYMENT_FAILED
      ) {
        for (const item of order.items) {
          try {
            const product = this.productsService.findOne(item.productId);
            if (product) {
              product.stock += item.quantity;
            }
          } catch {
            // bỏ qua nếu sản phẩm không tìm thấy
          }
        }
      }
    }

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  /**
   * Cỗ máy trạng thái đơn hàng (Order State Machine - FR-10)
   * Kiểm soát chặt chẽ các bước chuyển trạng thái hợp lệ
   */
  assertTransition(current: OrderStatus, next: OrderStatus): void {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [
        OrderStatus.PAID,
        OrderStatus.PAYMENT_FAILED,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PAID]: [OrderStatus.PREPARING],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.COMPLETED],
      [OrderStatus.PAYMENT_FAILED]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.COMPLETED]: [], // Trạng thái kết thúc
      [OrderStatus.CANCELLED]: [], // Trạng thái kết thúc
    };

    const allowed = allowedTransitions[current] || [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Không thể chuyển đổi trạng thái đơn hàng từ ${current} sang ${next}`
      );
    }
  }
}

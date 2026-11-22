import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from '../../apps/api/src/orders/orders.service';
import { ProductsService } from '../../apps/api/src/products/products.service';
import {
  OrderStatus,
  PaymentMethod,
  PickupType,
} from '../../apps/api/src/orders/order.entity';
import { CreateOrderDto } from '../../apps/api/src/orders/dto/create-order.dto';

describe('OrdersService (Unit Tests)', () => {
  let ordersService: OrdersService;
  let productsService: ProductsService;

  beforeEach(() => {
    productsService = new ProductsService();
    ordersService = new OrdersService(productsService);
  });

  describe('createOrder (FR-06)', () => {
    it('creates an order successfully with PENDING status and decrements stock', () => {
      const initialStock = productsService.findOne('1').stock; // Espresso has 12

      const dto: CreateOrderDto = {
        customerName: 'Nguyen Van A',
        customerPhone: '0901234567',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [
          { productId: '1', quantity: 2, size: 'M' },
        ],
      };

      const order = ordersService.createOrder(dto);

      expect(order).toBeDefined();
      expect(order.id).toMatch(/^ORD-/);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.customerName).toBe('Nguyen Van A');
      expect(order.customerPhone).toBe('0901234567');
      expect(order.items.length).toBe(1);
      expect(order.items[0].productName).toBe('Espresso');
      expect(order.items[0].quantity).toBe(2);
      expect(order.total).toBe(5.0); // 2.5 * 2 = 5.0

      // Stock must be decremented
      const updatedStock = productsService.findOne('1').stock;
      expect(updatedStock).toBe(initialStock - 2);
    });

    it('rejects order when cart is empty (BR-06)', () => {
      const dto: CreateOrderDto = {
        customerName: 'Nguyen Van A',
        customerPhone: '0901234567',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.CARD,
        items: [],
      };

      expect(() => ordersService.createOrder(dto)).toThrow(BadRequestException);
      expect(() => ordersService.createOrder(dto)).toThrow(/BR-06/);
    });

    it('rejects order when customer name is too short', () => {
      const dto: CreateOrderDto = {
        customerName: 'A',
        customerPhone: '0901234567',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [{ productId: '1', quantity: 1 }],
      };

      expect(() => ordersService.createOrder(dto)).toThrow(BadRequestException);
      expect(() => ordersService.createOrder(dto)).toThrow(/ít nhất 2 ký tự/);
    });

    it('rejects order with invalid phone number format', () => {
      const dto: CreateOrderDto = {
        customerName: 'Nguyen Van A',
        customerPhone: '123456', // invalid: not 10 digits
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [{ productId: '1', quantity: 1 }],
      };

      expect(() => ordersService.createOrder(dto)).toThrow(BadRequestException);
      expect(() => ordersService.createOrder(dto)).toThrow(/10 chữ số bắt đầu bằng số 0/);
    });

    it('rejects DINE_IN order without tableNumber', () => {
      const dto: CreateOrderDto = {
        customerName: 'Nguyen Van A',
        customerPhone: '0901234567',
        pickupType: PickupType.DINE_IN,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        items: [{ productId: '1', quantity: 1 }],
      };

      expect(() => ordersService.createOrder(dto)).toThrow(BadRequestException);
      expect(() => ordersService.createOrder(dto)).toThrow(/số bàn/);
    });

    it('rejects order when product does not exist', () => {
      const dto: CreateOrderDto = {
        customerName: 'Nguyen Van A',
        customerPhone: '0901234567',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [{ productId: 'non-existent-id', quantity: 1 }],
      };

      expect(() => ordersService.createOrder(dto)).toThrow(NotFoundException);
    });

    it('rejects order when product stock is insufficient', () => {
      // Product 5 (Mocha) has stock 0
      const dto: CreateOrderDto = {
        customerName: 'Nguyen Van A',
        customerPhone: '0901234567',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [{ productId: '5', quantity: 1 }],
      };

      expect(() => ordersService.createOrder(dto)).toThrow(BadRequestException);
      expect(() => ordersService.createOrder(dto)).toThrow(/không đủ số lượng/);
    });
  });

  describe('findOne & findAll', () => {
    it('returns order by id and throws for non-existent id', () => {
      const dto: CreateOrderDto = {
        customerName: 'Tran Thi B',
        customerPhone: '0987654321',
        pickupType: PickupType.DINE_IN,
        tableNumber: 'Table 05',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        items: [{ productId: '2', quantity: 1 }],
      };

      const created = ordersService.createOrder(dto);
      const found = ordersService.findOne(created.id);
      expect(found).toEqual(created);

      expect(() => ordersService.findOne('UNKNOWN-ID')).toThrow(NotFoundException);
    });

    it('findAll returns all created orders', () => {
      expect(ordersService.findAll().length).toBe(0);

      ordersService.createOrder({
        customerName: 'Khach A',
        customerPhone: '0900000001',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [{ productId: '1', quantity: 1 }],
      });

      ordersService.createOrder({
        customerName: 'Khach B',
        customerPhone: '0900000002',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.CARD,
        items: [{ productId: '2', quantity: 1 }],
      });

      expect(ordersService.findAll().length).toBe(2);
    });
  });

  describe('findAll sorting (Order History)', () => {
    it('returns orders sorted by createdAt descending', () => {
      const first = ordersService.createOrder({
        customerName: 'First',
        customerPhone: '0900000001',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [{ productId: '1', quantity: 1 }],
      });
      // ensure distinct timestamps
      const second = ordersService.createOrder({
        customerName: 'Second',
        customerPhone: '0900000002',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.CARD,
        items: [{ productId: '2', quantity: 1 }],
      });

      const all = ordersService.findAll();
      expect(all.length).toBe(2);
      expect(all[0].id).toBe(second.id);
      expect(all[1].id).toBe(first.id);
    });
  });

  describe('updateStatus & Order State Machine (FR-10)', () => {
    it('executes the full happy-path: PENDING -> PAID -> PREPARING -> READY -> COMPLETED', () => {
      const order = ordersService.createOrder({
        customerName: 'Le Van C',
        customerPhone: '0911223344',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [{ productId: '1', quantity: 1 }],
      });

      expect(order.status).toBe(OrderStatus.PENDING);

      const paidOrder = ordersService.updateStatus(order.id, OrderStatus.PAID);
      expect(paidOrder.status).toBe(OrderStatus.PAID);

      const preparingOrder = ordersService.updateStatus(order.id, OrderStatus.PREPARING);
      expect(preparingOrder.status).toBe(OrderStatus.PREPARING);

      const readyOrder = ordersService.updateStatus(order.id, OrderStatus.READY);
      expect(readyOrder.status).toBe(OrderStatus.READY);

      const completedOrder = ordersService.updateStatus(order.id, OrderStatus.COMPLETED);
      expect(completedOrder.status).toBe(OrderStatus.COMPLETED);
    });

    it('allows PENDING -> PAYMENT_FAILED -> PAID or CANCELLED', () => {
      const order = ordersService.createOrder({
        customerName: 'Hoang Van D',
        customerPhone: '0933445566',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.CARD,
        items: [{ productId: '1', quantity: 1 }],
      });

      const failedOrder = ordersService.updateStatus(order.id, OrderStatus.PAYMENT_FAILED);
      expect(failedOrder.status).toBe(OrderStatus.PAYMENT_FAILED);

      const retryPaid = ordersService.updateStatus(order.id, OrderStatus.PAID);
      expect(retryPaid.status).toBe(OrderStatus.PAID);
    });

    it('restores product stock when an order is cancelled from PENDING', () => {
      const initialStock = productsService.findOne('2').stock; // Americano

      const order = ordersService.createOrder({
        customerName: 'Doan Van E',
        customerPhone: '0977889900',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        items: [{ productId: '2', quantity: 3 }],
      });

      expect(productsService.findOne('2').stock).toBe(initialStock - 3);

      ordersService.updateStatus(order.id, OrderStatus.CANCELLED);
      expect(productsService.findOne('2').stock).toBe(initialStock);
    });

    it('rejects invalid transitions', () => {
      const order = ordersService.createOrder({
        customerName: 'Vu Thi F',
        customerPhone: '0944556677',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: PaymentMethod.MOMO,
        items: [{ productId: '1', quantity: 1 }],
      });

      // PENDING cannot skip directly to READY
      expect(() => ordersService.updateStatus(order.id, OrderStatus.READY)).toThrow(
        BadRequestException
      );

      // Advance to COMPLETED (terminal state)
      ordersService.updateStatus(order.id, OrderStatus.PAID);
      ordersService.updateStatus(order.id, OrderStatus.PREPARING);
      ordersService.updateStatus(order.id, OrderStatus.READY);
      ordersService.updateStatus(order.id, OrderStatus.COMPLETED);

      // Terminal state COMPLETED cannot transition to anything
      expect(() => ordersService.updateStatus(order.id, OrderStatus.PENDING)).toThrow(
        BadRequestException
      );
      expect(() => ordersService.updateStatus(order.id, OrderStatus.CANCELLED)).toThrow(
        BadRequestException
      );
    });
  });
});

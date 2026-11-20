import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../apps/api/src/orders/orders.controller';
import { OrdersService } from '../../apps/api/src/orders/orders.service';
import { ProductsModule } from '../../apps/api/src/products/products.module';
import {
  OrderStatus,
  PaymentMethod,
  PickupType,
} from '../../apps/api/src/orders/order.entity';
import { CreateOrderDto } from '../../apps/api/src/orders/dto/create-order.dto';

describe('OrdersController (Unit Tests)', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('delegates create to OrdersService', () => {
    const dto: CreateOrderDto = {
      customerName: 'Controller Test',
      customerPhone: '0912345678',
      pickupType: PickupType.TAKEAWAY,
      paymentMethod: PaymentMethod.MOMO,
      items: [{ productId: '1', quantity: 1 }],
    };

    const order = controller.create(dto);
    expect(order).toBeDefined();
    expect(order.customerName).toBe('Controller Test');
    expect(order.status).toBe(OrderStatus.PENDING);
  });

  it('delegates findAll and findOne to OrdersService', () => {
    const dto: CreateOrderDto = {
      customerName: 'Controller Test 2',
      customerPhone: '0987654321',
      pickupType: PickupType.DINE_IN,
      tableNumber: 'Table 10',
      paymentMethod: PaymentMethod.CARD,
      items: [{ productId: '2', quantity: 1 }],
    };

    const created = controller.create(dto);
    const all = controller.findAll();
    expect(all.length).toBe(1);

    const single = controller.findOne(created.id);
    expect(single.id).toBe(created.id);
  });

  it('delegates updateStatus to OrdersService', () => {
    const dto: CreateOrderDto = {
      customerName: 'Controller Test 3',
      customerPhone: '0911223344',
      pickupType: PickupType.TAKEAWAY,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      items: [{ productId: '1', quantity: 1 }],
    };

    const created = controller.create(dto);
    const updated = controller.updateStatus(created.id, {
      status: OrderStatus.PAID,
    });
    expect(updated.status).toBe(OrderStatus.PAID);
  });
});

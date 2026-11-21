import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCategory } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of products from findAll', () => {
    const result = controller.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return a single product by id from findOne', () => {
    const result = controller.findOne('prod-001');
    expect(result).toBeDefined();
    expect(result.id).toBe('prod-001');
  });

  it('should create a product via create endpoint', () => {
    const dto: CreateProductDto = {
      name: 'Cold Brew Mãng Cầu',
      price: 42000,
      stock: 20,
      category: ProductCategory.COFFEE,
    };
    const result = controller.create(dto);
    expect(result).toBeDefined();
    expect(result.name).toBe(dto.name);
  });

  it('should update a product via update endpoint', () => {
    const result = controller.update('prod-002', { price: 36000 });
    expect(result.price).toBe(36000);
  });

  it('should check stock availability', () => {
    const stockInfo = controller.checkStock('prod-001', '2');
    expect(stockInfo).toBeDefined();
    expect(typeof stockInfo.available).toBe('boolean');
  });
});

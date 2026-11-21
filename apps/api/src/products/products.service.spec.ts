import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCategory } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all available products', () => {
      const result = service.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((p) => p.isAvailable)).toBe(true);
    });

    it('should filter products by category', () => {
      const result = service.findAll({ category: ProductCategory.COFFEE });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((p) => p.category === ProductCategory.COFFEE)).toBe(true);
    });

    it('should filter products by search keyword', () => {
      const result = service.findAll({ search: 'Bạc Xỉu' });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name.toLowerCase()).toContain('bạc xỉu');
    });

    it('should return empty list when no product matches search', () => {
      const result = service.findAll({ search: 'NonExistentProductXYZ123' });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a product by valid id', () => {
      const product = service.findOne('prod-001');
      expect(product).toBeDefined();
      expect(product.id).toBe('prod-001');
      expect(product.name).toBe('Cà phê Phin Sữa Đá');
    });

    it('should throw NotFoundException when product is not found', () => {
      expect(() => service.findOne('invalid-id-999')).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new product with valid data', () => {
      const newProductDto: CreateProductDto = {
        name: 'Trà Sữa Oolong Nướng',
        description: 'Trà ô long nướng thơm đượm vị caramen.',
        category: ProductCategory.TEA,
        price: 38000,
        stock: 30,
        isAvailable: true,
      };

      const created = service.create(newProductDto);
      expect(created).toBeDefined();
      expect(created.name).toBe(newProductDto.name);
      expect(created.price).toBe(38000);
      expect(created.stock).toBe(30);

      // Verify it can be retrieved
      const found = service.findOne(created.id);
      expect(found).toBeDefined();
    });

    it('should throw BadRequestException if price is <= 0', () => {
      const invalidDto: CreateProductDto = {
        name: 'Trà Lỗi Giá',
        price: 0,
        stock: 10,
      };
      expect(() => service.create(invalidDto)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if stock is < 0', () => {
      const invalidDto: CreateProductDto = {
        name: 'Trà Lỗi Tồn Kho',
        price: 30000,
        stock: -5,
      };
      expect(() => service.create(invalidDto)).toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update product fields successfully', () => {
      const updated = service.update('prod-001', {
        price: 35000,
        stock: 60,
      });

      expect(updated.price).toBe(35000);
      expect(updated.stock).toBe(60);
    });

    it('should throw BadRequestException on invalid update price', () => {
      expect(() => service.update('prod-001', { price: -1000 })).toThrow(
        BadRequestException,
      );
    });
  });

  describe('checkStock', () => {
    it('should return available: true when stock >= requested quantity', () => {
      const result = service.checkStock('prod-001', 2);
      expect(result.available).toBe(true);
      expect(result.stock).toBeGreaterThanOrEqual(2);
    });

    it('should return available: false when product is out of stock (stock == 0)', () => {
      const result = service.checkStock('prod-007', 1);
      expect(result.available).toBe(false);
      expect(result.stock).toBe(0);
    });
  });
});

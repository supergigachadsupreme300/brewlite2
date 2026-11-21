import { NotFoundException } from '@nestjs/common';
import { ProductsService } from '../../apps/api/src/products/products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
  });

  it('returns the seeded product list', () => {
    const products = service.findAll();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
  });

  it('returns a product by id', () => {
    const product = service.findOne('1');
    expect(product.id).toBe('1');
    expect(product.name).toBe('Espresso');
  });

  it('throws NotFoundException for an unknown id', () => {
    expect(() => service.findOne('does-not-exist')).toThrow(NotFoundException);
  });
});
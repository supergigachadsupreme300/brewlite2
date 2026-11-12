import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product';
import { PRODUCTS_SEED } from './products.seed';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [...PRODUCTS_SEED];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" was not found`);
    }
    return product;
  }
}
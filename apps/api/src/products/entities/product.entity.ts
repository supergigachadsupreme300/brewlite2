export enum ProductCategory {
  COFFEE = 'COFFEE',
  TEA = 'TEA',
  FREEZE = 'FREEZE',
  PASTRY = 'PASTRY',
  OTHER = 'OTHER',
}

export interface ProductOption {
  size?: 'S' | 'M' | 'L';
  sugarLevel?: '0%' | '30%' | '50%' | '70%' | '100%';
  iceLevel?: '0%' | '30%' | '50%' | '70%' | '100%';
}

export class Product {
  id!: string;
  name!: string;
  description!: string;
  category!: ProductCategory;
  price!: number;
  stock!: number;
  imageUrl!: string;
  isAvailable!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<Product>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

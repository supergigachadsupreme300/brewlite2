export type ProductCategory = 'COFFEE' | 'TEA' | 'FREEZE' | 'PASTRY' | 'OTHER';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
  isAvailable: boolean;
}

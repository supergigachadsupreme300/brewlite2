export type ProductCategory = 'COFFEE' | 'TEA' | 'FREEZE' | 'PASTRY' | 'OTHER' | string;

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  isAvailable: boolean;
}

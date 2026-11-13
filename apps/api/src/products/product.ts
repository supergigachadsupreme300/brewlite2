export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export type ProductSummary = Pick<
  Product,
  'id' | 'name' | 'price' | 'imageUrl' | 'category' | 'stock'
>;
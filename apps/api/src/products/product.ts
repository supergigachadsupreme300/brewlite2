export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

export type ProductSummary = Pick<
  Product,
  'id' | 'name' | 'price' | 'imageUrl' | 'category' | 'available'
>;
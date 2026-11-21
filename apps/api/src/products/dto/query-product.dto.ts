import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class QueryProductDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;
}

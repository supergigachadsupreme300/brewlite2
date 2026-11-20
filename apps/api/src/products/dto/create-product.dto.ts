import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductCategory, { message: 'Danh mục không hợp lệ' })
  @IsOptional()
  category?: ProductCategory;

  @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
  @IsPositive({ message: 'Giá sản phẩm phải lớn hơn 0' })
  price!: number;

  @IsInt({ message: 'Tồn kho phải là số nguyên' })
  @Min(0, { message: 'Tồn kho không được âm' })
  stock!: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductCategory } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    new Product({
      id: 'prod-001',
      name: 'Cà phê Phin Sữa Đá',
      description: 'Cà phê Robusta Đắk Lắk pha phin truyền thống hòa quyện cùng sữa đặc béo ngậy.',
      category: ProductCategory.COFFEE,
      price: 29000,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=60',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Product({
      id: 'prod-002',
      name: 'Bạc Xỉu Sữa Tươi Nóng/Đá',
      description: 'Hương vị tuổi thơ với nhiều sữa, ít cà phê đắng nhẹ, thơm nồng cốt sữa tươi.',
      category: ProductCategory.COFFEE,
      price: 32000,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Product({
      id: 'prod-003',
      name: 'Cold Brew Cam Vàng Sả',
      description: 'Cà phê ủ lạnh 18 tiếng thanh mát kết hợp lát cam tươi và hương sả nồng ấm giải nhiệt.',
      category: ProductCategory.COFFEE,
      price: 45000,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Product({
      id: 'prod-004',
      name: 'Trà Đào Cam Sả Đặc Biệt',
      description: 'Trà đen Ceylon đậm đà, những miếng đào giòn ngọt lịm cùng vị chua thanh của cam tươi.',
      category: ProductCategory.TEA,
      price: 39000,
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Product({
      id: 'prod-005',
      name: 'Trà Hoa Cúc Mật Ong Nhiệt Đới',
      description: 'Thanh lọc cơ thể với trà cúc hoa thảo mộc vàng óng quyện chút mật ong hoa nhãn dịu ngọt.',
      category: ProductCategory.TEA,
      price: 35000,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Product({
      id: 'prod-006',
      name: 'Matcha Uji Đá Xay Kem Cheese',
      description: 'Bột trà xanh Uji Nhật Bản đá xay mịn màng phủ lớp kem cheese béo mặn sánh mịn.',
      category: ProductCategory.FREEZE,
      price: 49000,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Product({
      id: 'prod-007',
      name: 'Cà Phê Cốt Dừa Đá Xay',
      description: 'Vị béo thơm đậm vị cốt dừa Bến Tre xay cùng cà phê espresso đắng nhẹ đặc trưng.',
      category: ProductCategory.FREEZE,
      price: 49000,
      stock: 0, // Mock sản phẩm hết hàng để test tính năng FR-PROD-04
      imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Product({
      id: 'prod-008',
      name: 'Bánh Croissant Bơ Tỏi Nướng Giòn',
      description: 'Bánh sừng bò ngàn lớp thơm lừng nướng cùng bơ Pháp và sốt tỏi tây thơm phức.',
      category: ProductCategory.PASTRY,
      price: 32000,
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  findAll(query?: QueryProductDto): Product[] {
    let result = this.products.filter((p) => p.isAvailable);

    if (query?.category) {
      result = result.filter((p) => p.category === query.category);
    }

    if (query?.search && query.search.trim() !== '') {
      const keyword = query.search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword),
      );
    }

    return result;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm có mã "${id}"`);
    }
    return product;
  }

  create(createDto: CreateProductDto): Product {
    if (createDto.price <= 0) {
      throw new BadRequestException('Giá sản phẩm phải lớn hơn 0');
    }
    if (createDto.stock < 0) {
      throw new BadRequestException('Số lượng tồn kho không được âm');
    }

    const newProduct = new Product({
      id: `prod-${Date.now()}`,
      name: createDto.name,
      description: createDto.description ?? '',
      category: createDto.category ?? ProductCategory.COFFEE,
      price: createDto.price,
      stock: createDto.stock,
      imageUrl:
        createDto.imageUrl ??
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60',
      isAvailable: createDto.isAvailable ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.products.push(newProduct);
    return newProduct;
  }

  update(id: string, updateDto: UpdateProductDto): Product {
    const product = this.findOne(id);

    if (updateDto.price !== undefined && updateDto.price <= 0) {
      throw new BadRequestException('Giá sản phẩm phải lớn hơn 0');
    }
    if (updateDto.stock !== undefined && updateDto.stock < 0) {
      throw new BadRequestException('Số lượng tồn kho không được âm');
    }

    Object.assign(product, updateDto, { updatedAt: new Date() });
    return product;
  }

  remove(id: string): { success: boolean; message: string } {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy sản phẩm có mã "${id}"`);
    }
    this.products.splice(index, 1);
    return { success: true, message: `Đã xóa sản phẩm "${id}" thành công` };
  }

  checkStock(id: string, quantity: number): { available: boolean; stock: number } {
    const product = this.findOne(id);
    return {
      available: product.stock >= quantity && product.stock > 0,
      stock: product.stock,
    };
  }
}

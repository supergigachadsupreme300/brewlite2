import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product';
import { ProductsService } from './products.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(@Query() query?: QueryProductDto): Product[] {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createProductDto: CreateProductDto): Product {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Product {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string): { success: boolean; message: string } {
    return this.productsService.remove(id);
  }

  @Get(':id/check-stock')
  checkStock(
    @Param('id') id: string,
    @Query('quantity') quantity?: string,
  ): { available: boolean; stock: number } {
    const qty = quantity ? parseInt(quantity, 10) : 1;
    return this.productsService.checkStock(id, isNaN(qty) ? 1 : qty);
  }
}

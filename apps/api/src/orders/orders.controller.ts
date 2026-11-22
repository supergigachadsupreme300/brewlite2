import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';

@Controller('orders')
@UseGuards(OptionalAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req?: { user?: { id: string } }) {
    if (req?.user?.id) {
      createOrderDto.userId = req.user.id;
    }
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  findAll(@Req() req?: { user?: { id: string } }) {
    return this.ordersService.findAll(req?.user?.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req?: { user?: { id: string } }) {
    return this.ordersService.findOne(id, req?.user?.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req?: { user?: { id: string } },
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status,
      req?.user?.id,
    );
  }
}
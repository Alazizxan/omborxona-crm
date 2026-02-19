import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private service: OrdersService) { }

  // 🔹 AGENT CREATE
  @Roles('AGENT')
  @Post()
  create(@Body() body: CreateOrderDto, @Req() req: any) {
    return this.service.create(body, req.user.id);
  }


  @Roles('AGENT')
  @Get('agent-stats')
  stats(@Req() req: any) {
    return this.service.agentStats(req.user.id);
  }

  


   // 🔹 AGENT → FAQAT O‘Z ORDERLARI
  @Roles('AGENT')
  @Get('my')
  my(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Req() req?: any,
  ) {
    return this.service.filter(
      status,
      req.user.id,
      search,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }


  @Roles('AGENT', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user);
  }


  // 🔹 ADMIN → HAMMA ORDERLAR
  @Roles('ADMIN')
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.filter(
      status,
      undefined,
      search,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

 

  // 🔹 STATUS UPDATE
  @Roles('AGENT', 'ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
    @Req() req: any,
  ) {
    return this.service.updateStatus(id, body, req.user);
  }
}

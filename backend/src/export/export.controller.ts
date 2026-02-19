import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';
import { Response } from 'express';



@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportController {
  constructor(private service: ExportService) {}

  // ADMIN – hamma order
  @Roles('ADMIN')
  @Get('orders')
  async exportAll(@Res() res: Response) {
    const workbook = await this.service.exportAllOrders();
    await workbook.xlsx.write(res);
    res.end();
  }

  // AGENT – o‘z orderlari
  @Roles('AGENT')
  @Get('my')
  async exportMy(@Req() req: any, @Res() res: Response) {
    const workbook =
      await this.service.exportAgentOrders(req.user.id);
    await workbook.xlsx.write(res);
    res.end();
  }

  // ADMIN – agent orderlari
  @Roles('ADMIN')
  @Get('agent/:agentId')
  async exportAgent(
    @Param('agentId') agentId: string,
    @Res() res: Response,
  ) {
    const workbook =
      await this.service.exportAgentOrders(agentId);
    await workbook.xlsx.write(res);
    res.end();
  }

  // ADMIN + AGENT – bitta order
  @Roles('ADMIN', 'AGENT')
  @Get('order/:id')
  async exportSingle(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const workbook =
      await this.service.exportOrder(id, req.user);
    await workbook.xlsx.write(res);
    res.end();
  }
}

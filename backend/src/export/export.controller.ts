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

  // ================= ADMIN – hamma order =================
  @Roles('ADMIN')
  @Get('orders')
  async exportAll(@Res() res: Response) {
    const workbook = await this.service.exportAllOrders();
    await this.sendExcel(res, workbook, 'all-orders.xlsx');
  }

  // ================= AGENT – o‘z orderlari =================
  @Roles('AGENT')
  @Get('my')
  async exportMy(@Req() req: any, @Res() res: Response) {
    const workbook =
      await this.service.exportAgentOrders(req.user.id);

    await this.sendExcel(res, workbook, 'my-orders.xlsx');
  }

  // ================= ADMIN – agent orderlari =================
  @Roles('ADMIN')
  @Get('agent/:agentId')
  async exportAgent(
    @Param('agentId') agentId: string,
    @Res() res: Response,
  ) {
    const workbook =
      await this.service.exportAgentOrders(agentId);

    await this.sendExcel(res, workbook, `agent-${agentId}.xlsx`);
  }

  // ================= ADMIN + AGENT – bitta order =================
  @Roles('ADMIN', 'AGENT')
  @Get('order/:id')
  async exportSingle(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const workbook =
      await this.service.exportOrder(id, req.user);

    await this.sendExcel(res, workbook, `order-${id}.xlsx`);
  }

  /* ================= HELPER ================= */

  private async sendExcel(
    res: Response,
    workbook: any,
    filename: string,
  ) {
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}`,
    );

    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  }
}
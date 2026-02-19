import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { BorderStyle } from 'exceljs';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) { }

  // ================= ADMIN – HAMMA ORDER =================
  async exportAllOrders() {
    const orders = await this.getOrdersWithRelations();

    return this.buildOrdersTable(orders, 'All Orders');
  }

  // ================= AGENT – O‘Z ORDERLARI =================
  async exportAgentOrders(agentId: string) {
    const orders = await this.getOrdersWithRelations({
      agentId,
    });

    return this.buildOrdersTable(orders, 'Agent Orders');
  }

  // ================= BITTA ORDER =================
  async exportOrder(orderId: string, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        agent: true,
        items: { include: { product: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'AGENT' && order.agentId !== user.id) {
      throw new ForbiddenException();
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Order');

    /* ================= HEADER ================= */

    sheet.mergeCells('A1:E1');
    sheet.getCell('A1').value = `BUYURTMA: ${order.orderNumber}`;
    sheet.getCell('A1').font = { size: 16, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    sheet.addRow([]);

    sheet.addRow(['Agent', order.agent?.name]);
    sheet.addRow(['Mijoz', order.clientName]);
    sheet.addRow(['Telefon', order.clientPhone]);
    sheet.addRow(['Do‘kon', order.storeName]);
    sheet.addRow(['Manzil', order.address]);
    sheet.addRow(['Holat', order.status]);
    sheet.addRow(['Sana', order.createdAt]);

    sheet.addRow([]);
    sheet.addRow([]);

    /* ================= TABLE HEADER ================= */

    const headerRow = sheet.addRow([
      'Mahsulot',
      'Miqdor',
      'Narx',
      'Valyuta',
      'Jami',
    ]);

    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    headerRow.eachCell(cell => {
      cell.border = this.borderStyle();
    });

    /* ================= ITEMS ================= */

    order.items.forEach(item => {
      const total =
        Number(item.price) * Number(item.quantity);

      const row = sheet.addRow([
        item.product?.name,
        item.quantity,
        item.price,
        item.product?.currency,
        total,
      ]);

      row.eachCell(cell => {
        cell.border = this.borderStyle();
      });
    });

    sheet.addRow([]);

    /* ================= TOTAL ================= */

    const uzsRow = sheet.addRow([
      '',
      '',
      '',
      'Umumiy UZS',
      order.totalUZS || 0,
    ]);

    const usdRow = sheet.addRow([
      '',
      '',
      '',
      'Umumiy USD',
      order.totalUSD || 0,
    ]);

    uzsRow.font = { bold: true };
    usdRow.font = { bold: true };

    uzsRow.eachCell(cell => {
      cell.border = this.borderStyle();
    });

    usdRow.eachCell(cell => {
      cell.border = this.borderStyle();
    });

    /* ================= COLUMN WIDTH ================= */

    sheet.columns = [
      { width: 25 },
      { width: 12 },
      { width: 15 },
      { width: 12 },
      { width: 18 },
    ];

    return workbook;
  }


  private borderStyle(): Partial<ExcelJS.Borders> {
    return {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    } as Partial<ExcelJS.Borders>;
  }





  // ================= HELPER =================

  private async getOrdersWithRelations(where: any = {}) {
    return this.prisma.order.findMany({
      where,
      include: {
        agent: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private buildOrdersTable(orders: any[], title: string) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(title);

    // ======== COMPANY HEADER ========
    sheet.mergeCells('A1:K1');
    const companyHeader = sheet.getCell('A1');
    companyHeader.value = 'SALES REPORT';
    companyHeader.font = { size: 16, bold: true };
    companyHeader.alignment = { horizontal: 'center' };

    sheet.addRow([]);

    let currentRow = 3;

    let grandUZS = 0;
    let grandUSD = 0;

    for (const order of orders) {

      // ===== ORDER INFO BLOCK =====
      sheet.getCell(`A${currentRow}`).value =
        `Order: ${order.orderNumber}`;
      sheet.getCell(`A${currentRow}`).font = {
        bold: true,
      };
      currentRow++;

      sheet.addRow([
        'Agent',
        order.agent?.name,
        'Mijoz',
        order.clientName,
      ]);
      currentRow++;

      sheet.addRow([
        'Telefon',
        order.clientPhone,
        'Holat',
        order.status,
      ]);
      currentRow++;

      sheet.addRow([
        'Sana',
        order.createdAt,
      ]);
      sheet.getCell(`B${currentRow}`).numFmt =
        'dd.mm.yyyy hh:mm';
      currentRow++;

      sheet.addRow([]);
      currentRow++;

      // ===== TABLE HEADER =====
      const header = sheet.addRow([
        'Mahsulot',
        'Miqdor',
        'Narx',
        'Valyuta',
        'Jami',
      ]);

      header.font = { bold: true };
      header.alignment = { horizontal: 'center' };
      header.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFECECEC' },
        };
        cell.border = this.borderStyle();
      });

      currentRow++;

      // ===== ITEMS =====
      for (const item of order.items) {
        const total =
          Number(item.price) *
          Number(item.quantity);

        const row = sheet.addRow([
          item.product?.name,
          item.quantity,
          Number(item.price),
          item.product?.currency,
          total,
        ]);

        row.eachCell(cell => {
          cell.border = this.borderStyle();
        });

        if (item.product?.currency === 'UZS') {
          row.getCell(3).numFmt =
            '#,##0 "so\'m"';
          row.getCell(5).numFmt =
            '#,##0 "so\'m"';
        }

        if (item.product?.currency === 'USD') {
          row.getCell(3).numFmt =
            '$#,##0.00';
          row.getCell(5).numFmt =
            '$#,##0.00';
        }

        currentRow++;
      }

      // ===== ORDER TOTAL =====
      sheet.addRow([]);

      const uzsRow = sheet.addRow([
        '',
        '',
        '',
        'ORDER JAMI UZS',
        order.totalUZS || 0,
      ]);

      uzsRow.font = { bold: true };
      uzsRow.getCell(5).numFmt =
        '#,##0 "so\'m"';
      uzsRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9F9F9' },
        };
      });

      const usdRow = sheet.addRow([
        '',
        '',
        '',
        'ORDER JAMI USD',
        order.totalUSD || 0,
      ]);

      usdRow.font = { bold: true };
      usdRow.getCell(5).numFmt =
        '$#,##0.00';
      usdRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9F9F9' },
        };
      });

      grandUZS += Number(order.totalUZS || 0);
      grandUSD += Number(order.totalUSD || 0);

      sheet.addRow([]);
      sheet.addRow([]);
      currentRow += 4;
    }

    // ===== GRAND TOTAL =====
    sheet.addRow(['', '', '', 'UMUMIY UZS', grandUZS]);
    const g1 = sheet.lastRow;
    g1.font = { bold: true };
    g1.getCell(5).numFmt = '#,##0 "so\'m"';
    g1.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9EAD3' },
    };

    sheet.addRow(['', '', '', 'UMUMIY USD', grandUSD]);
    const g2 = sheet.lastRow;
    g2.font = { bold: true };
    g2.getCell(5).numFmt = '$#,##0.00';
    g2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9EAD3' },
    };

    sheet.columns = [
      { width: 25 },
      { width: 10 },
      { width: 15 },
      { width: 18 },
      { width: 18 },
    ];

    return workbook;
  }


}

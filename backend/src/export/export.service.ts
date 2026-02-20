import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) { }

  /* ================= ADMIN ================= */

  async exportAllOrders() {
    const orders = await this.getOrders();
    return this.buildOrdersTable(orders, 'ALL ORDERS');
  }

  async exportAgentOrders(agentId: string) {
    const orders = await this.getOrders({ agentId });
    return this.buildOrdersTable(orders, 'AGENT ORDERS');
  }

  /* ================= HELPER ================= */

  private async getOrders(where: any = {}) {
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

    // buildOrdersTable mavjud logikani ishlatamiz
    return this.buildOrdersTable([order], `ORDER-${order.orderNumber}`);
  }

  /* ================= MAIN BUILDER ================= */

  private buildOrdersTable(orders: any[], title: string) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(title);

    /* ========= HEADER ========= */

    sheet.mergeCells('A1:E1');
    const header = sheet.getCell('A1');
    header.value = 'SALES REPORT';
    header.font = { size: 18, bold: true };
    header.alignment = { horizontal: 'center' };

    sheet.addRow([]);

    let grandUZS = 0;
    let grandUSD = 0;

    const monthlyMap: Record<
      string,
      { uzs: number; usd: number }
    > = {};

    for (const order of orders) {
      /* ========= ORDER INFO ========= */

      const infoRow = sheet.addRow([
        `Order: ${order.orderNumber}`,
      ]);
      infoRow.font = { bold: true };
      sheet.addRow([
        'Agent',
        order.agent?.name,
        'Holat',
        order.status,
      ]);

      sheet.addRow([
        'Mijoz',
        order.clientName,
        'Telefon',
        order.clientPhone,
      ]);

      sheet.addRow([
        'Sana',
        order.createdAt,
      ]);

      sheet.addRow([]);

      /* ========= TABLE HEADER ========= */

      const tableHeader = sheet.addRow([
        'Mahsulot',
        'Miqdor',
        'Narx',
        'Valyuta',
        'Jami',
      ]);

      tableHeader.font = { bold: true };
      tableHeader.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEFEFEF' },
        };
        cell.border = this.border();
      });

      /* ========= ITEMS ========= */

      let orderUZS = 0;
      let orderUSD = 0;

      for (const item of order.items) {
        const total =
          Number(item.price) *
          Number(item.quantity);

        const row = sheet.addRow([
          item.product?.name,
          item.quantity,
          item.price,
          item.product?.currency,
          total,
        ]);

        row.eachCell((cell) => {
          cell.border = this.border();
        });

        if (item.product?.currency === 'UZS') {
          orderUZS += total;
        }
        if (item.product?.currency === 'USD') {
          orderUSD += total;
        }
      }

      /* ========= ORDER TOTAL ========= */

      sheet.addRow([]);

      const totalRow1 = sheet.addRow([
        '',
        '',
        '',
        'ORDER UZS',
        orderUZS,
      ]);

      const totalRow2 = sheet.addRow([
        '',
        '',
        '',
        'ORDER USD',
        orderUSD,
      ]);

      totalRow1.font = { bold: true };
      totalRow2.font = { bold: true };

      /* ========= GRAND TOTAL LOGIC ========= */

      if (order.status === 'COMPLETED') {
        grandUZS += orderUZS;
        grandUSD += orderUSD;

        const monthKey = new Date(
          order.createdAt,
        )
          .toISOString()
          .slice(0, 7);

        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {
            uzs: 0,
            usd: 0,
          };
        }

        monthlyMap[monthKey].uzs += orderUZS;
        monthlyMap[monthKey].usd += orderUSD;
      }

      sheet.addRow([]);
      sheet.addRow([]);
    }

    /* ========= GRAND TOTAL ========= */

    sheet.addRow([]);
    sheet.addRow([
      '',
      '',
      '',
      'UMUMIY UZS (FAqat COMPLETED)',
      grandUZS,
    ]).font = { bold: true };

    sheet.addRow([
      '',
      '',
      '',
      'UMUMIY USD (FAqat COMPLETED)',
      grandUSD,
    ]).font = { bold: true };

    /* ========= MONTHLY REPORT ========= */

    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow(['OYLIK HISOBOT']).font = {
      bold: true,
      size: 14,
    };

    const monthHeader = sheet.addRow([
      'Oy',
      'UZS',
      'USD',
    ]);
    monthHeader.font = { bold: true };

    Object.keys(monthlyMap).forEach(
      (month) => {
        sheet.addRow([
          month,
          monthlyMap[month].uzs,
          monthlyMap[month].usd,
        ]);
      },
    );

    sheet.columns = [
      { width: 25 },
      { width: 12 },
      { width: 15 },
      { width: 12 },
      { width: 18 },
    ];

    return workbook;
  }

  private border(): Partial<ExcelJS.Borders> {
    return {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
}
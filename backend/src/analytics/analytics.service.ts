import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) { }

  async dashboard() {
    const totalOrders = await this.prisma.order.count();

    const revenue = await this.prisma.order.aggregate({
      _sum: { totalUZS: true, totalUSD: true },
    });

    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const todayRevenue = await this.prisma.order.aggregate({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      _sum: { totalUZS: true, totalUSD: true },
    });

    const monthStart = dayjs().startOf('month').toDate();
    const monthEnd = dayjs().endOf('month').toDate();

    const monthRevenue = await this.prisma.order.aggregate({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { totalUZS: true, totalUSD: true },
    });

    return {
      totalOrders,
      totalUZS: Number(revenue._sum.totalUZS || 0),
      totalUSD: Number(revenue._sum.totalUSD || 0),
      todayUZS: Number(todayRevenue._sum.totalUZS || 0),
      todayUSD: Number(todayRevenue._sum.totalUSD || 0),
      monthUZS: Number(monthRevenue._sum.totalUZS || 0),
      monthUSD: Number(monthRevenue._sum.totalUSD || 0),

    };
  }

  


  async topAgents() {
    return this.prisma.user.findMany({
      where: { role: 'AGENT' },
      include: {
        orders: true,
      },
    });
  }
}



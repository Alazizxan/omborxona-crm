import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async generateOrderNumber() {
    const count = await this.prisma.order.count();
    const next = count + 1;
    return `ORD-${next.toString().padStart(5, '0')}`;
  }

  async create(dto: CreateOrderDto, agentId: string) {
    return this.prisma.$transaction(async (tx) => {

      const orderNumber = await this.generateOrderNumber();

      let totalUZS = 0;
      let totalUSD = 0;

      // 🔹 CLIENT DATA (default — dto dan)
      let clientName = dto.clientName;
      let clientPhone = dto.clientPhone;
      let storeName = dto.storeName;
      let address = dto.address;
      let clientId: string | null = null;

      // 🔥 Agar clientId yuborilgan bo‘lsa — DB dan olamiz
      if (dto.clientId) {
        const client = await tx.client.findUnique({
          where: { id: dto.clientId },
        });

        if (!client) {
          throw new Error('Client not found');
        }

        clientId = client.id;
        clientName = client.name;
        clientPhone = client.phone;
        storeName = client.storeName ?? '';
        address = client.address ?? '';
      }

      // 🔹 PRODUCT CHECK + TOTAL HISOBLASH
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product)
          throw new Error('Product not found');

        if (Number(product.quantity) < item.quantity)
          throw new Error(`${product.name} yetarli emas`);

        const itemTotal =
          Number(product.price) * item.quantity;

        if (product.currency === 'UZS') {
          totalUZS += itemTotal;
        } else {
          totalUSD += itemTotal;
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 🔹 ORDER CREATE
      return tx.order.create({
        data: {
          orderNumber,

          clientName,
          clientPhone,
          storeName,
          address,
          clientId, // 🔥 Yangi relation

          lat: dto.lat ?? null,
          lng: dto.lng ?? null,

          totalUZS,
          totalUSD,
          agentId,

          items: {
            create: dto.items.map(item => ({
              productId: item.productId,
              quantity: Number(item.quantity),
              price: Number(item.price),
            })),
          },
        },
        include: {
          client: true,
          items: true,
        },
      });
    });
  }


  async agentStats(agentId: string) {
    const orders = await this.prisma.order.aggregate({
      where: {
        agentId,
        status: 'COMPLETED', // 
      },
      _count: true,
      _sum: {
        totalUZS: true,
        totalUSD: true,
      },
    });

    return {
      totalOrders: orders._count,
      totalUZS: orders._sum.totalUZS || 0,
      totalUSD: orders._sum.totalUSD || 0,
    };
  }



  async updateStatus(id: string, dto: UpdateStatusDto, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) throw new Error('Order not found');

    if (user.role === 'AGENT' && order.agentId !== user.id) {
      throw new ForbiddenException();
    }

    // 🔥 AGAR CANCEL BO‘LAYOTGAN BO‘LSA STOCK QAYTARAMIZ
    if (dto.status === 'CANCELED' && order.status !== 'CANCELED') {

      await this.prisma.$transaction(async (tx) => {

        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        }

        await tx.order.update({
          where: { id },
          data: { status: dto.status },
        });
      });

      return { message: 'Order canceled and stock restored' };
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }


  async filter(
    status?: string,
    agentId?: string,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    const where: any = {
      AND: [],
    };

    // 🔹 Agent filter
    if (agentId) {
      where.AND.push({
        agentId: agentId,
      });
    }

    // 🔹 Status filter
    if (status) {
      where.AND.push({
        status: status,
      });
    }

    // 🔹 Search filter
    if (search) {
      where.AND.push({
        OR: [
          {
            clientName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            orderNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    return this.prisma.order.findMany({
      where: where.AND.length > 0 ? where : undefined,
      include: {
        agent: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  }


  async findOne(id: string, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        agent: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) throw new Error('Order not found');

    if (user.role === 'AGENT' && order.agentId !== user.id) {
      throw new ForbiddenException();
    }

    return order;
  }






  findMy(agentId: string) {
    return this.prisma.order.findMany({
      where: { agentId },
      include: {
        agent: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        agent: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}

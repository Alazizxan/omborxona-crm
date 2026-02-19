import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  // 🔹 CREATE (ADMIN)
  async create(data: any) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        unit: data.unit,
        quantity: Number(data.quantity),
        categoryId: data.categoryId,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }


  // 🔹 MINI APP — category bo‘yicha
  async findByCategory(categoryId: string) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔹 ADMIN — barcha mahsulotlar
  async findAll(search?: string) {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
        name: search
          ? {
            contains: search,
            mode: 'insensitive',
          }
          : undefined,
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }


  // 🔹 UPDATE
  async update(id: string, data: any) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name ?? product.name,
        description: data.description ?? product.description,
        price:
          data.price !== undefined
            ? Number(data.price)
            : product.price,
        unit: data.unit ?? product.unit,
        quantity:
          data.quantity !== undefined
            ? Number(data.quantity)
            : product.quantity,
      },
    });
  }




  // 🔹 SOFT DELETE
  async remove(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}



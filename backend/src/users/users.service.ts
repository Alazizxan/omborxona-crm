import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Agent yaratish
  async createAgent(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        password: hashed,
        role: 'AGENT',
      },
    });
  }

  // 🔹 Barcha agentlar (ADMIN)
  async findAllAgents() {
    return this.prisma.user.findMany({
      where: { role: 'AGENT' },
      select: {
        id: true,
        name: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔹 Agentni o‘chirish (soft delete qilmoqchi bo‘lsang keyin qo‘shamiz)
  async deleteAgent(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.delete({
      where: { id },
    });
  }

  // 🔹 O‘z profilini olish (AGENT)
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
      },
    });
  }
}

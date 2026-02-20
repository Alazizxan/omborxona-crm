import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }


    async create(dto: any) {
        return this.prisma.client.create({ data: dto });
    }

    async findAll(search?: string) {
        return this.prisma.client.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { phone: { contains: search } },
                    ],
                }
                : {},
            orderBy: { createdAt: 'desc' },
        });
    }

}
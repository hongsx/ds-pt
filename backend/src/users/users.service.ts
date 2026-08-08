import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(@Inject('PRISMA') private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(data: any) {
    // NOTE: In production, hash passwords!
    return this.prisma.user.create({ data });
  }
}

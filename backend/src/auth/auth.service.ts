import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private getJwtSecret(): string {
    return process.env.JWT_SECRET || 'dev-secret';
  }

  async register(data: { email: string; password: string; name?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({ data: { email: data.email, name: data.name, password: hashed } });
    const token = jwt.sign({ sub: user.id, email: user.email }, this.getJwtSecret(), { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name }, accessToken: token };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const token = jwt.sign({ sub: user.id, email: user.email }, this.getJwtSecret(), { expiresIn: '7d' });
    return { accessToken: token };
  }
}

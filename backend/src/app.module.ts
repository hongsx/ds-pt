import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersModule } from './users/users.module';

const prisma = new PrismaClient();

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: 'PRISMA',
      useValue: prisma,
    },
  ],
  exports: ['PRISMA'],
})
export class AppModule {}

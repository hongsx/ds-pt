import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: 'PRISMA', useExisting: PrismaService },
  ],
  exports: [PrismaService, 'PRISMA'],
})
export class PrismaModule {}

import { PrismaService } from '@common/infra/prisma/prisma.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaDatabaseModule {}

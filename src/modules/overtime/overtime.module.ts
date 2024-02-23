import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OverTimeEntity } from './entities/overtime.entity';

@Module({
  controllers: [],
  providers: [],
  imports: [TypeOrmModule.forFeature([OverTimeEntity])],
  exports: [],
})
export class OverTimeModule {}

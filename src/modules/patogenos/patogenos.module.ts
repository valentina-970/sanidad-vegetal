import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patogeno } from './entities/patogenos.entity.js';
import { PatogenosController } from './patogenos.controller.js';
import { PatogenosService } from './patogenos.service.js';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Patogeno, Enfermedad])],
  controllers: [PatogenosController],
  providers: [PatogenosService],
})
export class PatogenosModule {}
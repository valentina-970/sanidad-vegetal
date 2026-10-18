import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brote } from '../brotes/entities/brote.entity.js';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Patogeno } from '../patogenos/entities/patogenos.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { EstadisticasController } from './estadisticas.controller.js';
import { EstadisticasService } from './estadisticas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Brote, Planta, Enfermedad, Patogeno])],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}

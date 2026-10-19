import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { Susceptibilidad } from './entities/susceptibilidades.entity.js';
import { SusceptibilidadesController } from './susceptibilidades.controller.js';
import { SusceptibilidadesService } from './susceptibilidades.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Susceptibilidad, Planta, Enfermedad])],
  controllers: [SusceptibilidadesController],
  providers: [SusceptibilidadesService],
})
export class SusceptibilidadesModule { }

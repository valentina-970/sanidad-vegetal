import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivo } from '../cultivos/entities/cultivos.entity.js';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Susceptibilidad } from '../susceptibilidades/entities/susceptibilidades.entity.js';
import { Planta } from './entities/plantas.entity.js';
import { PlantasController } from './plantas.controller.js';
import { PlantasService } from './plantas.service.js';
import { Brote } from '../brotes/entities/brote.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Planta, Cultivo, Susceptibilidad, Enfermedad, Brote])],
  controllers: [PlantasController],
  providers: [PlantasService],
})
export class PlantasModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patogeno } from '../patogenos/entities/patogenos.entity.js';
import { EnfermedadesController } from './enfermedades.controller.js';
import { EnfermedadesService } from './enfermedades.service.js';
import { Enfermedad } from './entities/enfermedades.entity.js';
import { Tratamiento } from '../tratamientos/entities/tratamientos.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Enfermedad, Patogeno, Tratamiento])],
  controllers: [EnfermedadesController],
  providers: [EnfermedadesService],
})
export class EnfermedadesModule { }
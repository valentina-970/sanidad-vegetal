import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patogeno } from '../patogenos/entities/patogenos.entity.js';
import { EnfermedadesController } from './enfermedades.controller.js';
import { EnfermedadesService } from './enfermedades.service.js';
import { ENFERMEDADES_SERVICE } from './tokens.js';
import { Enfermedad } from './entities/enfermedades.entity.js';
import { Tratamiento } from '../tratamientos/entities/tratamientos.entity.js';
import { Susceptibilidad } from '../susceptibilidades/entities/susceptibilidades.entity.js';
import { Brote } from '../brotes/entities/brote.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Enfermedad, Patogeno, Tratamiento, Susceptibilidad, Brote])],
  controllers: [EnfermedadesController],
  providers: [{ provide: ENFERMEDADES_SERVICE, useClass: EnfermedadesService }],
})
export class EnfermedadesModule {}
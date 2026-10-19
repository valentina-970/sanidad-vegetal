import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Patogeno } from '../patogenos/entities/patogenos.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { Brote } from './entities/brote.entity.js';
import { BrotesController } from './brotes.controller.js';
import { BrotesService } from './brotes.service.js';
import { BROTES_SERVICE } from './tokens.js';

@Module({
  imports: [TypeOrmModule.forFeature([Brote, Planta, Enfermedad, Patogeno])],
  controllers: [BrotesController],
  providers: [{ provide: BROTES_SERVICE, useClass: BrotesService }],
})
export class BrotesModule {}
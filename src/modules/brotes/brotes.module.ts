import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { Brote } from './entities/brote.entity.js';
import { BrotesController } from './brotes.controller.js';
import { BrotesService } from './brotes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Brote, Planta, Enfermedad])],
  controllers: [BrotesController],
  providers: [BrotesService],
})
export class BrotesModule {}
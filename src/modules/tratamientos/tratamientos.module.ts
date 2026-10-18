import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Tratamiento } from './entities/tratamientos.entity.js';
import { TratamientosController } from './tratamientos.controller.js';
import { TratamientosService } from './tratamientos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tratamiento, Enfermedad])],
  controllers: [TratamientosController],
  providers: [TratamientosService],
})
export class TratamientosModule {}

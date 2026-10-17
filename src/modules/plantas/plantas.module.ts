import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planta } from './entities/plantas.entity.js';
import { PlantasController } from './plantas.controller.js';
import { PlantasService } from './plantas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Planta])],
  controllers: [PlantasController],
  providers: [PlantasService],
})
export class PlantasModule {}

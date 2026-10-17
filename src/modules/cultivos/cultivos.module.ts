import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { CultivosController } from './cultivos.controller.js';
import { CultivosService } from './cultivos.service.js';
import { Cultivo } from './entities/cultivos.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo, Planta])],
  controllers: [CultivosController],
  providers: [CultivosService],
})
export class CultivosModule {}

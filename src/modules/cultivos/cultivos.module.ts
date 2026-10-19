import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { CultivosController } from './cultivos.controller.js';
import { CultivosService } from './cultivos.service.js';
import { CULTIVOS_SERVICE } from './tokens.js';
import { Cultivo } from './entities/cultivos.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo, Planta])],
  controllers: [CultivosController],
  providers: [{ provide: CULTIVOS_SERVICE, useClass: CultivosService }],
})
export class CultivosModule {}

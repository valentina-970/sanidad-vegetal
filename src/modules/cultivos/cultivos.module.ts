import { Module } from '@nestjs/common';
import { CultivosController } from './cultivos.controller';
import { CultivosService } from './cultivos.service';

@Module({
  controllers: [CultivosController],
  providers: [CultivosService]
})
export class CultivosModule {}

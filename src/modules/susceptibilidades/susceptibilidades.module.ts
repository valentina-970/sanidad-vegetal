import { Module } from '@nestjs/common';
import { SusceptibilidadesService } from './susceptibilidades.service';
import { SusceptibilidadesController } from './susceptibilidades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Susceptibilidades } from './entities/susceptibilidade.entity';

@Module({
  controllers: [SusceptibilidadesController],
  providers: [SusceptibilidadesService],
  imports: [TypeOrmModule.forFeature([Susceptibilidades])],
  exports: [SusceptibilidadesService],
})
export class SusceptibilidadesModule {}

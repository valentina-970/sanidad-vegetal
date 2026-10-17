import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PlantasModule } from './modules/plantas/plantas.module';
import { PatogenosModule } from './modules/patogenos/patogenos.module.js';
import { EnfermedadesModule } from './modules/enfermedades/enfermedades.module';
import { SusceptibilidadesModule } from './modules/susceptibilidades/susceptibilidades.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    PlantasModule,
    PatogenosModule,
    EnfermedadesModule,
    SusceptibilidadesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
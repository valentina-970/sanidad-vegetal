import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

// Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Sanidad Vegetal')
    .setDescription('Documentación interactiva de la API')
  const configuracion = new DocumentBuilder()
    .setTitle('API de Sanidad Vegetal')
    .setDescription('API de Breaze in the Moon para gestionar plantas, patógenos, enfermedades, tratamientos, cultivos y brotes')
    .setVersion('1.0')
    .build();
  const documento = SwaggerModule.createDocument(app, configuracion);
  SwaggerModule.setup('docs', app, documento);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
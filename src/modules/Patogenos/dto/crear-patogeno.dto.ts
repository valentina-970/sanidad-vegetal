import { ApiProperty } from '@nestjs/swagger';

export class CrearPatogenoDto {
  @ApiProperty({ description: 'Nombre del patógeno' })
  nombre: string;

  @ApiProperty({ description: 'Nombre científico del patógeno (debe ser único)' })
  nombreCientifico: string;

  @ApiProperty({ description: 'Valores permitidos: virus, hongo, oomiceto, bacteria, insecto, nematodo' })
  tipo: string;

  @ApiProperty({ description: 'Valores permitidos: viento, agua, suelo, contacto, insectos_vectores, otro' })
  formaTransmision: string;

  @ApiProperty({ description: 'Secuencia de referencia (solo letras A, C, G, T en mayúscula)' })
  secuenciaGenetica: string;
}

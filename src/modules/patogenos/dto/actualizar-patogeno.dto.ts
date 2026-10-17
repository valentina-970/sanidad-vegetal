import { ApiProperty } from '@nestjs/swagger';

export class ActualizarPatogenoDto {
  @ApiProperty({ description: 'Nombre del patógeno', required: false })
  nombre?: string;

  @ApiProperty({ description: 'Nombre científico del patógeno (debe ser único)', required: false })
  nombreCientifico?: string;

  @ApiProperty({
    description: 'Valores permitidos: virus, hongo, oomiceto, bacteria, insecto, nematodo',
    required: false,
  })
  tipo?: string;

  @ApiProperty({
    description: 'Valores permitidos: viento, agua, suelo, contacto, insectos_vectores, otro',
    required: false,
  })
  formaTransmision?: string;

  @ApiProperty({
    description: 'Secuencia de referencia (solo letras A, C, G, T en mayúscula)',
    required: false,
  })
  secuenciaGenetica?: string;
}


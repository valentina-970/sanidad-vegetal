import { ApiProperty } from '@nestjs/swagger';

export class ActualizarTratamientoDto {
  @ApiProperty({ description: 'Nombre del tratamiento', required: false })
  nombre?: string;

  @ApiProperty({ description: 'Descripción de cómo aplicar el tratamiento', required: false })
  descripcionAplicacion?: string;

  @ApiProperty({ description: 'Valores permitidos: quimico, biologico, cultural', required: false })
  tipo?: string;

  @ApiProperty({ description: 'Id de la enfermedad que se trata (debe existir)', required: false })
  enfermedadId?: number;
}
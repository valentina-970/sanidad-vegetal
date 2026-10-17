import { ApiProperty } from '@nestjs/swagger';

export class ActualizarEnfermedadDto {
  @ApiProperty({ description: 'Nombre de la enfermedad', required: false })
  nombre?: string;

  @ApiProperty({ description: 'Descripción de los síntomas de la enfermedad', required: false })
  sintomas?: string;

  @ApiProperty({
    description: 'Valores permitidos: primavera, verano, otono, invierno, todo_el_anio',
    required: false,
  })
  epocaRiesgo?: string;

  @ApiProperty({ description: 'Id del patógeno que causa la enfermedad (debe existir)', required: false })
  patogenoId?: number;
}

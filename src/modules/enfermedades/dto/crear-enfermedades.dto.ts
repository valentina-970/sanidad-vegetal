import { ApiProperty } from '@nestjs/swagger';

export class CrearEnfermedadDto {
  @ApiProperty({ description: 'Nombre de la enfermedad' })
  nombre: string;

  @ApiProperty({ description: 'Descripción de los síntomas de la enfermedad' })
  sintomas: string;

  @ApiProperty({ description: 'Valores permitidos: primavera, verano, otono, invierno, todo_el_anio' })
  epocaRiesgo: string;

  @ApiProperty({ description: 'Id del patógeno que causa la enfermedad (debe existir)' })
  patogenoId: number;
}

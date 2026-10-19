import { ApiProperty } from '@nestjs/swagger';

export class CrearBroteDto {
  @ApiProperty({ description: 'Id de la planta (debe existir)', example: 1 })
  plantaId: number;

  @ApiProperty({ description: 'Id de la enfermedad (debe existir)', example: 1 })
  enfermedadId: number;

  @ApiProperty({ description: 'Región geográfica del brote', example: 'Andina' })
  region: string;

  @ApiProperty({ description: 'Fecha del brote en formato YYYY-MM-DD (no futura)', example: '2026-05-10' })
  fecha: string;

  @ApiProperty({ description: 'Hectáreas afectadas (mayor que 0, hasta 2 decimales)', example: 12.5 })
  hectareasAfectadas: number;
}
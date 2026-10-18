import { ApiProperty } from '@nestjs/swagger';

export class ActualizarBroteDto {
  @ApiProperty({ description: 'Id de la planta', required: false })
  plantaId?: number;

  @ApiProperty({ description: 'Id de la enfermedad', required: false })
  enfermedadId?: number;

  @ApiProperty({ description: 'Región geográfica del brote', required: false })
  region?: string;

  @ApiProperty({ description: 'Fecha del brote en formato YYYY-MM-DD', required: false })
  fecha?: string;

  @ApiProperty({ description: 'Hectáreas afectadas (mayor que 0)', required: false })
  hectareas?: number;
}
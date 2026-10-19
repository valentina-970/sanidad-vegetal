import { ApiProperty } from '@nestjs/swagger';

export class EstadisticaBrotesDto {
  @ApiProperty({ description: 'Grupo: enfermedad, patógeno, región, tipo de cultivo o año-mes', example: 'Tizón tardío' })
  grupo: string;

  @ApiProperty({ description: 'Cantidad de brotes del grupo', example: 5 })
  totalBrotes: number;

  @ApiProperty({ description: 'Total de hectáreas afectadas del grupo', example: 45.5 })
  totalHectareas: number;
}
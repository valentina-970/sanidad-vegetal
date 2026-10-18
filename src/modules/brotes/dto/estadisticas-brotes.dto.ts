import { ApiProperty } from '@nestjs/swagger';

export class ItemEstadisticaDto {
  @ApiProperty({ description: 'Categoría o grupo (enfermedad, patógeno, región, cultivo o mes)', example: 'Andina' })
  grupo: string;

  @ApiProperty({ description: 'Cantidad total de brotes registrados', example: 5 })
  totalBrotes: number;

  @ApiProperty({ description: 'Total de hectáreas afectadas', example: 45.5 })
  totalHectareas: number;
}

export class EstadisticasBrotesDto {
  @ApiProperty({ type: [ItemEstadisticaDto], description: 'Estadísticas agrupadas por enfermedad' })
  porEnfermedad: ItemEstadisticaDto[];

  @ApiProperty({ type: [ItemEstadisticaDto], description: 'Estadísticas agrupadas por patógeno' })
  porPatogeno: ItemEstadisticaDto[];

  @ApiProperty({ type: [ItemEstadisticaDto], description: 'Estadísticas agrupadas por región' })
  porRegion: ItemEstadisticaDto[];

  @ApiProperty({ type: [ItemEstadisticaDto], description: 'Estadísticas agrupadas por tipo de cultivo o planta' })
  porCultivo: ItemEstadisticaDto[];

  @ApiProperty({ type: [ItemEstadisticaDto], description: 'Estadísticas agrupadas por mes' })
  porMes: ItemEstadisticaDto[];
}
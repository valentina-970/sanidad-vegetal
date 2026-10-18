import { ApiProperty } from '@nestjs/swagger';

export class MutacionDto {
    @ApiProperty({ description: 'Posición de la base, contando desde 1', example: 4 })
    posicion: number;

    @ApiProperty({ description: 'Letra en la secuencia de referencia de la planta', example: 'G' })
    referencia: string;

    @ApiProperty({ description: 'Letra en el código genético de la semilla', example: 'A' })
    semilla: string;
}

export class ResultadoMutacionesDto {
    @ApiProperty({ example: 5 })
    cultivoId: number;

    @ApiProperty({ example: 1 })
    plantaId: number;

    @ApiProperty({ description: 'Longitud de las dos secuencias comparadas', example: 20 })
    longitud: number;

    @ApiProperty({ example: 3 })
    totalMutaciones: number;

    @ApiProperty({ type: [MutacionDto] })
    mutaciones: MutacionDto[];
}

import { ApiProperty } from '@nestjs/swagger';

export class CrearCultivoDto {
    @ApiProperty({ description: 'Id de la planta cultivada (debe existir)', example: 1 })
    plantaId: number;

    @ApiProperty({ description: 'Lote o finca donde está el cultivo', example: 'Finca La Esperanza - Lote 3' })
    loteFinca: string;

    @ApiProperty({ description: 'Región del cultivo', example: 'Caldas' })
    region: string;

    @ApiProperty({ description: 'Fecha de siembra en formato YYYY-MM-DD, no futura', example: '2026-03-15' })
    fechaSiembra: string;

    @ApiProperty({ description: 'Código genético de la semilla (solo letras A, C, G, T en mayúscula)', example: 'ATGGCTAGCTAGGCTAACGT' })
    codigoGeneticoSemilla: string;
}

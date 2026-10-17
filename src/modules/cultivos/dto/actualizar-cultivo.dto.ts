import { ApiProperty } from '@nestjs/swagger';

export class ActualizarCultivoDto {
    @ApiProperty({ description: 'Id de la planta cultivada (debe existir)', required: false })
    plantaId?: number;

    @ApiProperty({ description: 'Lote o finca donde está el cultivo', required: false })
    loteFinca?: string;

    @ApiProperty({ description: 'Región del cultivo', required: false })
    region?: string;

    @ApiProperty({ description: 'Fecha de siembra en formato YYYY-MM-DD, no futura', required: false })
    fechaSiembra?: string;

    @ApiProperty({ description: 'Código genético de la semilla (solo letras A, C, G, T en mayúscula)', required: false })
    codigoGeneticoSemilla?: string;
}

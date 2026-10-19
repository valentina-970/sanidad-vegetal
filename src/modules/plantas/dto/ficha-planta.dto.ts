import { ApiProperty } from '@nestjs/swagger';

export class EnfermedadConNivelDto {
    @ApiProperty({ example: 7 })
    enfermedadId: number;

    @ApiProperty({ example: 'Tizón tardío' })
    nombre: string;

    @ApiProperty({ example: 'Manchas oscuras en hojas y tallos' })
    sintomas: string;

    @ApiProperty({ example: 'invierno' })
    epocaRiesgo: string;

    @ApiProperty({ example: 2 })
    patogenoId: number;

    @ApiProperty({ description: 'Nivel de susceptibilidad de la planta a esta enfermedad', example: 'alta' })
    nivel: string;
}

export class FichaPlantaDto {
    @ApiProperty({
        example: {
            id: 1,
            nombreComun: 'Papa',
            nombreCientifico: 'Solanum tuberosum',
            familiaBotanica: 'Solanaceae',
            tipoCultivo: 'hortaliza',
            secuenciaGenetica: 'ATGCCGTTAGCAGGTACCTA',
        },
    })
    planta: object;

    @ApiProperty({
        example: [
            {
                id: 4,
                plantaId: 1,
                loteFinca: 'Finca El Roble - Lote 2',
                region: 'Boyacá',
                fechaSiembra: '2026-02-10',
                codigoGeneticoSemilla: 'ATGCCGTTAGCAGGTACCTA',
            },
        ],
    })
    cultivos: object[];

    @ApiProperty({ type: [EnfermedadConNivelDto] })
    enfermedades: EnfermedadConNivelDto[];
}

import { ApiProperty } from '@nestjs/swagger';

export class CrearPlantaDto {
    @ApiProperty({ description: 'Nombre común de la planta', example: 'Tomate' })
    nombreComun: string;

    @ApiProperty({ description: 'Nombre científico (debe ser único)', example: 'Solanum lycopersicum' })
    nombreCientifico: string;

    @ApiProperty({ description: 'Familia botánica', example: 'Solanaceae' })
    familiaBotanica: string;

    @ApiProperty({ description: 'Valores permitidos: hortaliza, frutal, cereal, ornamental, otro', example: 'hortaliza' })
    tipoCultivo: string;

    @ApiProperty({ description: 'Secuencia de referencia (solo letras A, C, G, T en mayúscula)', example: 'ATGGCTAGCTAGGCTAACGT' })
    secuenciaGenetica: string;
}

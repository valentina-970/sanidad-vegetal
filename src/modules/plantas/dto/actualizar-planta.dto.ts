import { ApiProperty } from '@nestjs/swagger';

export class ActualizarPlantaDto {
    @ApiProperty({ description: 'Nombre común de la planta', required: false })
    nombreComun?: string;

    @ApiProperty({ description: 'Nombre científico (debe ser único)', required: false })
    nombreCientifico?: string;

    @ApiProperty({ description: 'Familia botánica', required: false })
    familiaBotanica?: string;

    @ApiProperty({ description: 'Valores permitidos: hortaliza, frutal, cereal, ornamental, otro', required: false })
    tipoCultivo?: string;

    @ApiProperty({ description: 'Secuencia de referencia (solo letras A, C, G, T en mayúscula)', required: false })
    secuenciaGenetica?: string;
}

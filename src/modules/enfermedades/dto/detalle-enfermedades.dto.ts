import { ApiProperty } from '@nestjs/swagger';

export class DetalleEnfermedadDto {
    @ApiProperty({
        example: {
            id: 3,
            nombre: 'Tizón tardío de la papa',
            sintomas: 'Manchas oscuras aceitosas en hojas y tallos',
            epocaRiesgo: 'invierno',
            patogenoId: 3,
        },
    })
    enfermedad: object;

    @ApiProperty({
        example: {
            id: 3,
            nombre: 'Tizón tardío',
            nombreCientifico: 'Phytophthora infestans',
            tipo: 'oomiceto',
            formaTransmision: 'agua',
            secuenciaGenetica: 'ATGAAGTTCGCTCTTGGCACCGGAATTCTCGAG',
        },
    })
    patogeno: object;

    @ApiProperty({
        example: [
            {
                id: 5,
                nombre: 'Fungicida sistémico y de contacto',
                descripcionAplicacion: 'Aplicar la mezcla recomendada de forma preventiva antes de las lluvias',
                tipo: 'quimico',
                enfermedadId: 3,
            },
        ],
    })
    tratamientos: object[];
}
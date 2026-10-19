import { ApiProperty } from '@nestjs/swagger';

export class CrearTratamientoDto {
  @ApiProperty({ description: 'Nombre del tratamiento' })
  nombre: string;

  @ApiProperty({ description: 'Descripción de cómo aplicar el tratamiento' })
  descripcionAplicacion: string;

  @ApiProperty({ description: 'Valores permitidos: quimico, biologico, cultural' })
  tipo: string;

  @ApiProperty({ description: 'Id de la enfermedad que se trata (debe existir)' })
  enfermedadId: number;
}

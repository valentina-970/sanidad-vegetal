import {ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSusceptibilidadeDto {
    @IsNumber()
    @IsNotEmpty()
    plantaId: number;

    @IsNumber()
    @IsNotEmpty()
    enfermedad: number;

    @IsNumber()
    @IsNotEmpty()
    nivel: number;

}

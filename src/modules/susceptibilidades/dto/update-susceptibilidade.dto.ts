import { PartialType } from '@nestjs/swagger';
import { CreateSusceptibilidadeDto } from './create-susceptibilidade.dto';

export class UpdateSusceptibilidadeDto extends PartialType(CreateSusceptibilidadeDto) {}

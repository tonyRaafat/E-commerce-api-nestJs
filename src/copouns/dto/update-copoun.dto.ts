import { PartialType } from '@nestjs/swagger';
import { CreateCopounDto } from './create-copoun.dto';

export class UpdateCopounDto extends PartialType(CreateCopounDto) {}

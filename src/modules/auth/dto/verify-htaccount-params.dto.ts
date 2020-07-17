import { IsString } from 'class-validator';
import { Required } from '@/shared/validation/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VeriyHTAccountParamsDTO {
  @ApiProperty()
  @IsString()
  @Required()
  readonly code: string;
  @ApiProperty()
  @IsString()
  @Required()
  readonly secret_key: string;
}

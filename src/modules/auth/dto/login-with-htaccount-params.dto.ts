import { IsString } from 'class-validator';
import { Required } from '@/shared/validation/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWithHTAccountParamsDTO {
  @ApiProperty()
  @IsString()
  @Required()
  readonly code: string;
}

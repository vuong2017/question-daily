import { Required } from '@/shared/validation/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsString } from 'class-validator';

export class ChoiceParamsDTO {
  @Required()
  @IsString()
  @ApiProperty()
  readonly name: string;
  @Required()
  @IsString()
  @ApiProperty()
  readonly question_id: string;
  @Required()
  @IsBoolean()
  @ApiProperty()
  readonly is_corect: boolean;
}

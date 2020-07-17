import { IsString, IsBoolean } from 'class-validator';
import { Required } from '@/shared/validation/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionDailyParamsDTO {
  @ApiProperty()
  @IsString()
  @Required()
  readonly user_id?: string;
  @ApiProperty()
  @IsString()
  @Required()
  readonly question_id?: string;
  @ApiProperty()
  @IsBoolean()
  readonly is_reply?: boolean;
}

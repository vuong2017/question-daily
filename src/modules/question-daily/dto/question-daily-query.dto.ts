import { ApiProperty } from '@nestjs/swagger';
import { Query } from '@/shared/dto/query.dto';

export class QuestionDailyQueryDTO extends Query {
  @ApiProperty({ required: false, isArray: true, type: 'string' })
  readonly user_ids?: string[];
  @ApiProperty({ required: false })
  readonly question?: string;
  @ApiProperty({ required: false })
  readonly is_reply?: boolean;
  @ApiProperty({ required: false })
  readonly start_at_gte?: string;
  @ApiProperty({ required: false })
  readonly end_at_lte?: string;
}

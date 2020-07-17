import { ApiProperty } from '@nestjs/swagger';
import { Query } from '@/shared/dto/query.dto';

export class ChoiceQueryDTO extends Query {
  @ApiProperty({ required: false })
  readonly name: string;
  @ApiProperty({ required: false })
  readonly question_id: string;
  @ApiProperty({ required: false })
  readonly is_corect: boolean;
  @ApiProperty({ required: false })
  readonly start_at_gte: string;
  @ApiProperty({ required: false })
  readonly end_at_lte: string;
}

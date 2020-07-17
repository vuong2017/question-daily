import { ApiProperty } from '@nestjs/swagger';
import { Query } from '@/shared/dto/query.dto';

export class UserQueryDTO extends Query {
  @ApiProperty({ required: false })
  readonly full_name: string;
  @ApiProperty({required: false})
  readonly role_id: number;
  @ApiProperty({ required: false })
  readonly start_at_gte: string;
  @ApiProperty({ required: false })
  readonly end_at_lte: string;
  @ApiProperty({ required: false })
  readonly order: string;
}

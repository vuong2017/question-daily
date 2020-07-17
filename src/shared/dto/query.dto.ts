import { ApiProperty } from '@nestjs/swagger';

export class Query {
    @ApiProperty()
    readonly page?: number;
    @ApiProperty()
    readonly per_page?: number;
}

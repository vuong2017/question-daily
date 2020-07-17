import { IsString } from 'class-validator';
import { Required } from '@/shared/validation/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionParamsDTO {
    @ApiProperty()
    @IsString()
    @Required()
    readonly question: string;
}

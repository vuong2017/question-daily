import { IsString, IsEmail, IsNumber, Max, Min } from 'class-validator';
import { Required } from '@/shared/validation/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterWithHTAccountParamsDTO {
  readonly ht_id: string;
  @ApiProperty()
  @IsEmail()
  @Required()
  readonly email: string;
  @ApiProperty()
  @IsString()
  @Required()
  readonly firstname: string;
  @ApiProperty()
  @IsString()
  @Required()
  readonly lastname: string;
  @IsNumber()
  @Min(0)
  @Max(1)
  @Required()
  readonly role_id: number;
}

export class ResponseHTAccount extends RegisterWithHTAccountParamsDTO {
  @ApiProperty()
  @IsString()
  @Required()
  readonly token: string;
}

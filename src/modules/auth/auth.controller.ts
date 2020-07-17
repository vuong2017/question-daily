import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { authMessages } from '@/shared/constants';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginWithHTAccountParamsDTO } from './dto';
import { AuthService } from './auth.service';
import { HtaccountPayload } from './interface/ht-account-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  @Post('/login-with-htactive')
  async loginWithHtactive(
    @Res() res: Response,
    @Body() body: LoginWithHTAccountParamsDTO,
  ) {
    const bodyVerifyHTAccount = {
      client_id: this._configService.get<string>('CLIENT_ID'),
      client_secret: this._configService.get<string>('CLIENT_SECRET'),
      code: body.code,
    };
    this._authService
      .loginWithHtaccount(bodyVerifyHTAccount)
      .subscribe(async response => {
        const decode = this._jwtService.decode(
          response.data.access_token,
        ) as HtaccountPayload;
        const htUser = {
          ht_id: decode.id,
          email: decode.email,
          lastname: decode.lastname,
          firstname: decode.firstname,
          role_id: decode.email === 'admin@mail.com' ? 0 : 1,
        };
        const user = await this._authService.registerWithHTAccount(htUser);
        return res.status(HttpStatus.OK).json({
          message: authMessages.LOGIN_SUCCESS,
          data: user,
        });
      });
  }
}

import { Injectable, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { JwtPayload } from './interface/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { RegisterWithHTAccountParamsDTO, ResponseHTAccount } from '../user/dto';
import { htAccount } from '@/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
    private readonly _httpService: HttpService,
  ) {}

  private async generateToken(data: JwtPayload): Promise<string> {
    const payload: JwtPayload = {
      email: data.email,
      role_id: data.role_id,
      user_id: data.user_id,
    };
    return this._jwtService.signAsync(payload);
  }

  async registerWithHTAccount(
    params: RegisterWithHTAccountParamsDTO,
  ): Promise<ResponseHTAccount> {
    const user = await this._userService.findByHTID(params.ht_id);
    if (!user) {
      const newUser = await this._userService.addUserWithHTAccount(params);
      return this.responseUser(newUser);
    } else {
      return this.responseUser(user);
    }
  }

  async responseUser(user) {
    const payload = {
      email: user.email,
      role_id: user.role_id,
      user_id: user._id,
    };
    const token = await this.generateToken(payload);
    return {
      ...user.toObject(),
      token,
    };
  }

  async validateUser(payload: JwtPayload) {
    return this._userService.getOne({ email: payload.email });
  }

  loginWithHtaccount(bodyVerifyHTAccount): Observable<any> {
    return this._httpService.post(htAccount.url, bodyVerifyHTAccount);
  }
}

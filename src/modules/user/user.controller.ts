import { Controller, Get, Res, Req, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';
import { crudMessages } from '@/shared/constants';
import { User } from './user.model';
import { Permissions } from '@/shared/decorator/permissions.decorator';
import { PermissionsGuard } from '@/shared/guard/permissions.guard';
import { roles } from '@/app.config';
import { UserQueryDTO } from './dto';

@ApiTags(User.modelName)
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private _userService: UserService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions([roles.admin])
    async getUsers(@Res() res: Response, @Query() userQuery: UserQueryDTO) {
        const users = await this._userService.getUsersPaginate(userQuery);
        return res.status(HttpStatus.OK).json({
            message: crudMessages.GET_DATA_SUCCESS,
            data: users,
        });
    }

    @Get('get-me')
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions([roles.admin, roles.user])
    async getMe(@Res() res: Response, @Req() req) {
        const user = await this._userService.getMe(req.user._id);
        return res.status(HttpStatus.OK).json({
            message: crudMessages.GET_DATA_SUCCESS,
            data: user,
        });
    }
}

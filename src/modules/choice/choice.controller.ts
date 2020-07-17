import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Res,
  Param,
  NotFoundException,
  HttpStatus,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { Response } from 'express';
import { ChoiceParamsDTO, ChoiceQueryDTO } from './dto';
import { crudMessages } from '@/shared/constants';
import { Choice } from './choice.model';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '@/shared/decorator/permissions.decorator';
import { PermissionsGuard } from '@/shared/guard/permissions.guard';
import { roles } from '@/app.config';

@ApiTags(Choice.modelName)
@ApiBearerAuth()
@Controller('choice')
export class ChoiceController {
  constructor(private readonly choiceService: ChoiceService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async findAllPage(@Res() res: Response, @Query() query: ChoiceQueryDTO) {
    const choice = await this.choiceService.getChoices(query);
    return res.status(HttpStatus.OK).json({
      message: crudMessages.GET_DATA_SUCCESS,
      data: choice,
    });
  }

  @Get(':choiceId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async getCustomer(@Res() res: Response, @Param('choiceId') choiceId: string) {
    const choice = await this.choiceService.getById(choiceId);
    if (!choice) {
      throw new NotFoundException(`not found ${choiceId}`);
    }
    return res.status(HttpStatus.OK).json({
      message: crudMessages.GET_DATA_SUCCESS,
      data: choice,
    });
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async create(@Res() res: Response, @Body() choiceParamsDTO: ChoiceParamsDTO) {
    const choice = await this.choiceService.addChoice(choiceParamsDTO);
    return res.status(HttpStatus.CREATED).json({
      message: crudMessages.CREATE_DATA_SUCCESS,
      data: choice,
    });
  }

  @Put(':choiceId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async updateChoice(
    @Res() res,
    @Param('choiceId') choiceId,
    @Body() choiceParamsDTO: ChoiceParamsDTO,
  ) {
    const choice = await this.choiceService.updateChoice(
      choiceId,
      choiceParamsDTO,
    );
    if (!choice) throw new NotFoundException('Choice does not exist!');
    return res.status(HttpStatus.OK).json({
      message: crudMessages.UPDATE_DATA_SUCCESS,
      choice,
    });
  }

  @Delete(':choiceId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async deleteCustomer(@Res() res, @Param('choiceId') choiceId: string) {
    const choice = await this.choiceService.delete(choiceId);
    if (!choice) throw new NotFoundException('Choice does not exist');
    return res.status(HttpStatus.OK).json({
      message: crudMessages.DELETE_DATA_SUCCESS,
      choice,
    });
  }
}

import { Controller, Get, Post, Put, Res, Req, Body, Query, Param, HttpStatus, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionDailyService } from './question-daily.service';
import { QuestionDailyParamsDTO, QuestionDailyQueryDTO } from './dto';
import { crudMessages } from '@/shared/constants';
import { QuestionDaily } from './question-daily.model';
import { Permissions } from '@/shared/decorator/permissions.decorator';
import { PermissionsGuard } from '@/shared/guard/permissions.guard';
import { roles } from '@/app.config';

@ApiTags(QuestionDaily.modelName)
@ApiBearerAuth()
@Controller('question-daily')
export class QuestionDailyController {
  constructor(private questionDailyService: QuestionDailyService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async getQuestionDailyPaginate(@Res() res: Response, @Query() query: QuestionDailyQueryDTO) {
    const questionDailys = await this.questionDailyService.getQuestionDailyPaginate(query);
    return res.status(HttpStatus.OK).json({
      message: crudMessages.GET_DATA_SUCCESS,
      data: questionDailys,
    });
  }

  @Get('question-daily-by-user')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin, roles.user])
  async getQuestionDailyByUser(@Res() res: Response, @Req() req) {
    const questionDailys = await this.questionDailyService.getQuestionDailyAggregate({user_ids: req.user._id});
    return res.status(HttpStatus.OK).json({
      message: crudMessages.GET_DATA_SUCCESS,
      data: questionDailys,
    });
  }

  @Get(':questionDailyId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async getQuestionDaily(@Res() res: Response, @Param('questionDailyId') questionDailyId: string) {
    const questionDaily = await this.questionDailyService.getById(
      questionDailyId,
    );
    if (!questionDaily) {
      throw new NotFoundException(questionDailyId);
    }
    return res.status(HttpStatus.OK).json({
      message: crudMessages.GET_DATA_SUCCESS,
      data: questionDaily,
    });
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async addQuestionDaily(@Res() res: Response, @Body() questionDailyParamsDTO: QuestionDailyParamsDTO) {
    const questionDaily = await this.questionDailyService.addQuestionDaily(
      questionDailyParamsDTO,
    );
    return res.status(HttpStatus.CREATED).json({
      message: crudMessages.CREATE_DATA_SUCCESS,
      data: questionDaily,
    });
  }

  @Put(':questionDailyId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async updateQuestionDaily(
    @Res() res: Response,
    @Param('questionDailyId') questionDailyId: string,
    @Body() questionDailyParamsDTO: QuestionDailyParamsDTO,
  ) {
    const questionDaily = await this.questionDailyService.updateQuestionDaily(
      questionDailyId,
      questionDailyParamsDTO,
    );
    if (!questionDaily) {
      throw new NotFoundException(questionDailyId);
    }
    return res.status(HttpStatus.OK).json({
      message: crudMessages.UPDATE_DATA_SUCCESS,
      data: questionDaily,
    });
  }

  @Put('mark-done/:questionDailyId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin, roles.user])
  async markDoneQuestionDaily(
    @Res() res: Response,
    @Param('questionDailyId') questionDailyId: string,
  ) {
    const questionDaily = await this.questionDailyService.updateQuestionDaily(
      questionDailyId,
      {
        is_reply: true,
      },
    );
    if (!questionDaily) {
      throw new NotFoundException(questionDailyId);
    }
    return res.status(HttpStatus.OK).json({
      message: crudMessages.UPDATE_DATA_SUCCESS,
      data: questionDaily,
    });
  }

  @Delete(':questionDailyId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async deleteQuestionDaily( @Res() res: Response, @Param('questionDailyId') questionDailyId: string) {
    const questionDaily = await this.questionDailyService.delete(
      questionDailyId,
    );
    if (!questionDaily) {
      throw new NotFoundException(questionDailyId);
    }
    return res.status(HttpStatus.OK).json({
      message: crudMessages.DELETE_DATA_SUCCESS,
      data: questionDaily,
    });
  }
}

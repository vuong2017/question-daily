import { Controller, Get, Post, Put, Res, Body, Param, Query, HttpStatus, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { QuestionService } from './question.service';
import { QuestionParamsDTO, QuestionQueryDTO } from './dto';
import { crudMessages } from '@/shared/constants';
import { Question } from './question.model';
import { Permissions } from '@/shared/decorator/permissions.decorator';
import { PermissionsGuard } from '@/shared/guard/permissions.guard';
import { roles } from '@/app.config';

@ApiTags(Question.modelName)
@ApiBearerAuth()
@Controller('question')
export class QuestionController {
  constructor(private _questionService: QuestionService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async getQuestionsPaginate(@Res() res: Response, @Query() query: QuestionQueryDTO) {
    const questions = await this._questionService.getQuestions(query);
    return res.status(HttpStatus.OK).json({
      message: crudMessages.GET_DATA_SUCCESS,
      data: questions,
    });
  }

  @Get(':questionId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async getQuestion(@Res() res: Response, @Param('questionId') questionId: string) {
    const question = await this._questionService.getById(questionId);
    if (!question) {
      throw new NotFoundException(questionId);
    }
    return res.status(HttpStatus.OK).json({
      message: crudMessages.GET_DATA_SUCCESS,
      data: question,
    });
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async addQuestion(@Res() res: Response, @Body() questionParamsDTO: QuestionParamsDTO) {
    const question = await this._questionService.addQuestion(questionParamsDTO);
    return res.status(HttpStatus.CREATED).json({
      message: crudMessages.CREATE_DATA_SUCCESS,
      data: question,
    });
  }

  @Put(':questionId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async updateQuestion(@Res() res: Response, @Param('questionId') questionId: string, @Body() questionParamsDTO: QuestionParamsDTO) {
    const question = await this._questionService.updateQuestion(questionId, questionParamsDTO);
    if (!question) {
      throw new NotFoundException(questionId);
    }
    return res.status(HttpStatus.OK).json({
      message: crudMessages.UPDATE_DATA_SUCCESS,
      data: question,
    });
  }

  @Delete(':questionId')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions([roles.admin])
  async deleteQuestion(@Res() res: Response, @Param('questionId') questionId: string) {
    const question = await this._questionService.deleteQuestionRelationship(questionId);
    if (!question) {
      throw new NotFoundException(questionId);
    }
    return res.status(HttpStatus.OK).json({
      message: crudMessages.DELETE_DATA_SUCCESS,
      data: question,
    });
  }
}

import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@/shared/base.service';

import { QuestionDaily } from './question-daily.model';
import { QuestionDailyParamsDTO, QuestionDailyQueryDTO } from './dto';
import { UserService } from '../user/user.service';
import { QuestionService } from '../question/question.service';


@Injectable()
export class QuestionDailyService extends BaseService<QuestionDaily> {
  constructor(
    @InjectModel(QuestionDaily.modelName) 
    private readonly questionDailyModel: Model<QuestionDaily>,
    private readonly _userService: UserService,
    @Inject(forwardRef(() => QuestionService))
    private readonly _questionService: QuestionService) {
    super(questionDailyModel);
  }

  public async autoCreateQuesition() {
    const users = await this._userService.getUsers();
    const userIds: string[] = users.map(x => (x as any)._id);
    const questions = await this.getAllQuestionDaily({user_ids: userIds});
    const groupByUserIds = this.groupByUserIds(userIds, questions);
    const createQuestionMultipleUserRandom = await this.createQuestionMultipleUserRandom(groupByUserIds);
    return createQuestionMultipleUserRandom;
  }

  public async createQuestionMultipleUserRandom(groupByUserIds) {
    const result = {};
    return new Promise(async (success,error) => {
      for await (let [index, userId] of Object.keys(groupByUserIds).entries()) {
        const notInQuestions =  groupByUserIds[userId].map(question => question.question_id);
        const questionsRandom = await this._questionService.getQuestionsRandom(5, notInQuestions);
        const questionsRandomMap = questionsRandom.map(question => ({ user_id: userId, question_id: question._id }))
        let questions = [];
        if (questionsRandomMap.length > 0) {
          questions = await this.questionDailyModel.insertMany(questionsRandomMap);
        }
        result[userId] = questions;
        if (Object.keys(groupByUserIds).length - 1 === index) {
          success(result);
        }
      }
    })
  }

  public groupByUserIds(userIds: string[], questions: QuestionDaily[]) {
    const group = {};
    questions.forEach(question => {
      if (question.is_reply) {
        return;
      }
      (group[question.user_id] = group[question.user_id] || []).push(question);
    });
    userIds.forEach(id => {
      if (!group[id]) {
        group[id] = [];
      }
    })
    return group;
  }

  public getUserIds(userIds: string[]) {
    const checkEmptyId = (id) => id ? Types.ObjectId(id) : '';
    const ids = Array.isArray(userIds)
      ? userIds.map(userId => checkEmptyId(userId))
      : [checkEmptyId(userIds)];
    return ids;
  }

  public async getAllQuestionDaily(questionQueryDTO: QuestionDailyQueryDTO) {
    const query = this.query(questionQueryDTO);
    return this.questionDailyModel.aggregate([query]);
  }

  public async getQuestionDailyPaginate(questionQueryDTO: QuestionDailyQueryDTO): Promise<QuestionDaily[]> {
    const aggregate = this.getQuestionDailyAggregate(questionQueryDTO);
    const options = {
      page: questionQueryDTO.page,
      limit: questionQueryDTO.per_page,
    }
    return await this.getPaginate(aggregate, options);
  }

  public getQuestionDailyAggregate(questionQueryDTO: QuestionDailyQueryDTO) {
    const query = this.query(questionQueryDTO);
    const joinQuestion = this.joinQuestion();
    const joinChoices = this.joinChoices();
    const aggregate = [
      joinQuestion,
      { $unwind: "$question" },
      joinChoices,
      query,
    ]
    return this.questionDailyModel.aggregate(aggregate);
  }

  public joinQuestion() {
    const myJoinQuestion = {
      $lookup: {
        from: "questions",
        localField: "question_id",
        foreignField: "_id",
        as: "question"
      }
    };
    return myJoinQuestion;
  }

  public joinChoices() {
    const myJoinChoices = {
      $lookup: {
        from: "choices",
        localField: "question._id",
        foreignField: "question_id",
        as: "question.choices"
      }
    };
    return myJoinChoices;
  }

  public query(questionQueryDTO: QuestionDailyQueryDTO) {
    const userIds = this.getUserIds(questionQueryDTO.user_ids);
    const myQuery = {
      created_at: { $gte: new Date(questionQueryDTO.start_at_gte), $lt: new Date(questionQueryDTO.end_at_lte) },
      is_reply: String(questionQueryDTO.is_reply) === 'true',
      user_id: { $in: userIds },
    };
    if (questionQueryDTO.question) {
      myQuery['question.question'] = new RegExp(questionQueryDTO.question, 'i');
    }
    const match = {
      "$match": this.autoDeletePropertyEmpty(myQuery),
    };
    return match;
  }

  async addQuestionDaily(questionDailyParamsDTO: QuestionDailyParamsDTO): Promise<QuestionDaily> {
    const newQuestionDaily = await this.questionDailyModel.create(questionDailyParamsDTO);
    return newQuestionDaily;
  }

  async updateQuestionDaily(questionDailyID: string, questionDailyParamsDTO: QuestionDailyParamsDTO): Promise<QuestionDaily> {
    const options = { new: true };
    const updateQuestionDaily = await this.questionDailyModel.findByIdAndUpdate(
      questionDailyID,
      questionDailyParamsDTO,
      options,
    );
    return updateQuestionDaily;
  }

  public async deleteManyByQuestionId(question_id: string, options?: any): Promise<QuestionDaily> {
    const questionDaily = await this.questionDailyModel.deleteMany({question_id}, options);
    return questionDaily;
  }

}

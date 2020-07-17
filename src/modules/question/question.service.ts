import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './question.model';
import { QuestionParamsDTO, QuestionQueryDTO } from './dto';
import { BaseService } from '../../shared/base.service';
import { ChoiceService } from '../choice/choice.service';
import { QuestionDailyService } from '../question-daily/question-daily.service';

@Injectable()
export class QuestionService extends BaseService<Question> {
  constructor(
    @InjectModel(Question.modelName)
    private readonly questionModel: Model<Question>,
    private readonly choiceService: ChoiceService,
    @Inject(forwardRef(() => QuestionDailyService))
    private readonly questionDailyService: QuestionDailyService,
  ) {
    super(questionModel);
  }

  public async getQuestionsRandom(size: number, notInQuestionIds: string[]) {
    const aggregate = [
      {
        $match: {
          _id: {
            $nin: notInQuestionIds.map(id => Types.ObjectId(id)),
          },
        },
      },
      {
        $sample: { size },
      },
    ];
    return this.questionModel.aggregate(aggregate);
  }

  public async getQuestions(
    questionQueryDTO: QuestionQueryDTO,
  ): Promise<Question[]> {
    const aggregate = this.getQuestionsAggregate(questionQueryDTO);
    const options = {
      page: questionQueryDTO.page,
      limit: questionQueryDTO.per_page,
    };
    return await this.getPaginate(aggregate, options);
  }

  public getQuestionsAggregate(questionQueryDTO: QuestionQueryDTO) {
    const query = this.query(questionQueryDTO);
    const joinChoices = this.joinChoices();
    const sort = this.sort(questionQueryDTO);
    const aggregate = [query, joinChoices, sort];
    return this.questionModel.aggregate(aggregate);
  }

  public joinChoices() {
    const myJoinChoices = {
      $lookup: {
        from: 'choices',
        localField: '_id',
        foreignField: 'questionId',
        as: 'choices',
      },
    };
    return myJoinChoices;
  }

  public query(questionQueryDTO: QuestionQueryDTO) {
    const myQuery = {
      question: new RegExp(questionQueryDTO.question, 'i'),
      created_at: {
        $gte: new Date(questionQueryDTO.start_at_gte),
        $lt: new Date(questionQueryDTO.end_at_lte),
      },
    };
    const match = {
      $match: this.autoDeletePropertyEmpty(myQuery),
    };
    return match;
  }

  public sort(questionQueryDTO: QuestionQueryDTO) {
    const value = questionQueryDTO.order && questionQueryDTO.order.split('-').length === 2 ? -1 : 1;
    const sort = {
      $sort: {
        [questionQueryDTO.order && questionQueryDTO.order.replace('-', '')]: value,
      },
    };
    return sort;
  }

  public async addQuestion(
    questionParamsDTO: QuestionParamsDTO,
  ): Promise<Question> {
    const newQuestion = await this.questionModel.create(questionParamsDTO);
    return newQuestion;
  }

  public async updateQuestion(
    questionID: string,
    questionParamsDTO: QuestionParamsDTO,
  ): Promise<Question> {
    const options = { new: true };
    const updateQuestion = await this.questionModel.findByIdAndUpdate(
      questionID,
      questionParamsDTO,
      options,
    );
    return updateQuestion;
  }

  public async deleteQuestionRelationship(id: string) {
    const session = await this.questionModel.startSession();
    session.startTransaction();
    try {
      const options = { session };
      const question = await this.delete(id, options);
      await this.choiceService.deleteManyByQuestionId(id, options);
      await this.questionDailyService.deleteManyByQuestionId(id, options);
      await session.commitTransaction();
      return question;
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}

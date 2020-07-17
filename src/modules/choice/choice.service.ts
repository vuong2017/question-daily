import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Choice } from './choice.model';
import { ChoiceParamsDTO, ChoiceQueryDTO } from './dto';
import { BaseService } from '../../shared/base.service';

@Injectable()
export class ChoiceService extends BaseService<Choice> {
  constructor(
    @InjectModel(Choice.modelName) private readonly choiceModel: Model<Choice>,
  ) {
    super(choiceModel);
  }
  public async getChoices(choiceQueryDTO: ChoiceQueryDTO): Promise<Choice[]> {
    const aggregate = this.getChoicesAggregate(choiceQueryDTO);
    const options = {
      page: choiceQueryDTO.page,
      limit: choiceQueryDTO.per_page,
    };
    return await this.getPaginate(aggregate, options);
  }
  public getChoicesAggregate(choiceQueryDTO: ChoiceQueryDTO) {
    const query = this.query(choiceQueryDTO);
    const aggregate = [query];
    return this.choiceModel.aggregate(aggregate);
  }
  public query(choiceQueryDTO: ChoiceQueryDTO) {
    const myQuery = {
      name: new RegExp(choiceQueryDTO.name, 'i'),
      question_id: choiceQueryDTO.question_id ? Types.ObjectId(choiceQueryDTO.question_id) : '',
      created_at: {
        $gte: new Date(choiceQueryDTO.start_at_gte),
        $lt: new Date(choiceQueryDTO.end_at_lte),
      },
    };
    const match = {
      $match: this.autoDeletePropertyEmpty(myQuery),
    };
    return match;
  }
  public async addChoice(choiceParamsDTO: ChoiceParamsDTO): Promise<Choice> {
    const newChoice = await this.choiceModel.create(choiceParamsDTO);
    return newChoice;
  }

  public async updateChoice(
    choiceId: string,
    choiceParamsDTO: ChoiceParamsDTO,
  ): Promise<Choice> {
    const options = { new: true };
    const updatedChoice = await this.choiceModel.findByIdAndUpdate(
      choiceId,
      choiceParamsDTO,
      options,
    );
    return updatedChoice;
  }

  public async deleteManyByQuestionId(question_id: string, options?: any): Promise<Choice> {
    const choices = await this.choiceModel.deleteMany({question_id}, options);
    return choices;
  }
}

import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { prop, plugin, ModelType } from 'typegoose';

import { BaseModel, schemaOptions } from '@/shared/base.model';
@plugin(aggregatePaginate)

export class Question extends BaseModel<Question> {
  @prop({ required: true })
  readonly question: string;

  static get model(): ModelType<Question> {
    return new Question().getModelForClass(Question, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}


import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { prop, plugin, ModelType } from 'typegoose';
import { Types } from 'mongoose';

import { BaseModel, schemaOptions } from '@/shared/base.model';
@plugin(aggregatePaginate)

export class QuestionDaily extends BaseModel<QuestionDaily> {

  @prop({ required: true})
  readonly user_id: Types.ObjectId;

  @prop({ required: true })
  readonly question_id: Types.ObjectId;

  @prop({ required: true, default: false})
  readonly is_reply: boolean;
  

  static get model(): ModelType<QuestionDaily> {
    return new QuestionDaily().getModelForClass(QuestionDaily, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}


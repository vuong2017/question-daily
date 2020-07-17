import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { prop, plugin, ModelType } from 'typegoose';
import { Types } from 'mongoose';

import { BaseModel, schemaOptions } from '@/shared/base.model';
@plugin(aggregatePaginate)
export class Choice extends BaseModel<Choice> {
  @prop({ required: true })
  readonly name: string;
  @prop({ required: true })
  readonly question_id: Types.ObjectId;
  @prop({ required: true })
  readonly is_corect: Boolean;

  static get model(): ModelType<Choice> {
    return new Choice().getModelForClass(Choice, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}

import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { prop, plugin, ModelType } from 'typegoose';

import { BaseModel, schemaOptions } from '@/shared/base.model';
@plugin(aggregatePaginate)

export class User extends BaseModel<User> {
  @prop({ required: true })
  readonly ht_id: string;
  @prop({ required: true })
  readonly email: string;
  @prop({ required: true })
  readonly firstname: string;
  @prop({ required: true })
  readonly lastname: string;
  @prop({ required: true, default: 1 })
  readonly role_id: number;

  static get model(): ModelType<User> {
    return new User().getModelForClass(User, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}

import { Typegoose, prop } from 'typegoose';
import { SchemaOptions } from 'mongoose';
export abstract class BaseModel<T> extends Typegoose {
    @prop()
    readonly created_at: Date;
    @prop()
    readonly updated_at: Date;
}

export const schemaOptions: SchemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
};

import { Model, Document } from 'mongoose';
import { Options } from '@/shared/interface/aggregate-pagination.interface';
export class BaseService<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public getAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  public getPaginate(aggregate: any, options: Options): Promise<T[]> {
    const myOptions: Options = {
      ...options,
      customLabels: {
        limit: 'perPage',
      },
    };
    return this.model.aggregatePaginate(aggregate, myOptions);
  }

  getOne(filter = {}): Promise<T> {
    return this.model.findOne(filter);
  }

  public getById(id: string): Promise<T> {
    return this.model.findById(id).exec();
  }

  public delete(id: string, options?: any): Promise<T> {
    return this.model.findByIdAndRemove(id, options);
  }

  public autoDeletePropertyEmpty = (object: any) => {
    const myObject = object;
    for (const key in myObject) {
      if (typeof myObject[key] === 'object') {
        this.autoDeletePropertyEmpty(myObject[key]);
        if (
          !Object.keys(myObject[key]).length &&
          !(myObject[key] instanceof RegExp) &&
          !(myObject[key] instanceof Date)
        ) {
          delete myObject[key];
        }
      }
      // tslint:disable-next-line
      if (myObject[key] == new Date('') + '') {
        delete myObject[key];
      }
      if (['', null, undefined].includes(myObject[key])) {
        delete myObject[key];
      }
    }
    return myObject;
  }
}

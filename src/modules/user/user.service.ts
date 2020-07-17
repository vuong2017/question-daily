import { Injectable } from '@nestjs/common';
import { Model, InstanceType } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { BaseService } from '../../shared/base.service';
import { RegisterWithHTAccountParamsDTO, UserQueryDTO } from './dto';

@Injectable()
export class UserService extends BaseService<User> {

  projectDefault = {
    role_id: 1,
    email: 1,
    created_at: 1,
    updated_at: 1,
  };

  constructor(
    @InjectModel(User.modelName) private readonly _userModel: Model<User>,
  ) {
    super(_userModel);
  }

  public async getUsers(): Promise<User[]> {
    return this.getAll();
  }

  public async getUsersPaginate(
    userQueryDTO: UserQueryDTO,
  ): Promise<User[]> {
    const aggregate = this.getUsersAggregate(userQueryDTO);
    const options = {
      page: userQueryDTO.page,
      limit: userQueryDTO.per_page,
    };
    return await this.getPaginate(aggregate, options);
  }

  public getUsersAggregate(userQueryDTO: UserQueryDTO) {
    const concatFullName = this.concatFullName();
    const query = this.query(userQueryDTO);
    const joinQuestionsDaily = this.joinQuestionsDaily();
    const countQuestionNoReply = this.countQuestionNoReply();
    const sort = this.sort(userQueryDTO);
    const aggregate = [
      concatFullName,
      query,
      joinQuestionsDaily,
      countQuestionNoReply,
      sort,
    ];
    return this._userModel.aggregate(aggregate);
  }

  public joinQuestionsDaily() {
    const myJoinChoices = {
      $lookup: {
        from: 'questiondailies',
        localField: '_id',
        foreignField: 'user_id',
        as: 'questionsDaily',
      },
    };
    return myJoinChoices;
  }

  public query(userQueryDTO: UserQueryDTO) {
    const myQuery = {
      full_name: new RegExp(userQueryDTO.full_name, 'i'),
      created_at: {
        $gte: new Date(userQueryDTO.start_at_gte),
        $lt: new Date(userQueryDTO.end_at_lte),
      },
      role_id: userQueryDTO.role_id && +userQueryDTO.role_id,
    };
    const match = {
      $match: this.autoDeletePropertyEmpty(myQuery),
    };
    return match;
  }

  public concatFullName() {
    return {
      $project: {
        full_name : { $concat : [ '$firstname', ' ', '$lastname' ]},
        ...this.projectDefault,
      },
    };
  }

  public countQuestionNoReply() {
    return {
      $project: {
        full_name : 1,
        ...this.projectDefault,
        count_question_no_reply: {
          $sum: {
            $map: {
              input: '$questionsDaily',
              as: 'questionsDaily',
              in: {
                $cond: [ '$$questionsDaily.is_reply', 0, 1],
              },
            },
          },
        },
      },
    };
  }

  public sort(userQueryDTO: UserQueryDTO) {
    const value = userQueryDTO.order && userQueryDTO.order.split('-').length === 2 ? -1 : 1;
    const sort = {
      $sort: {
        [userQueryDTO.order && userQueryDTO.order.replace('-', '')]: value,
      },
    };
    return sort;
  }

  public async getMe(_id: string): Promise<User> {
    return this.getOne({ _id });
  }

  public async findByHTID(ht_id: string): Promise<InstanceType<User>> {
    return this.getOne({ ht_id });
  }

  public async addUserWithHTAccount(
    params: RegisterWithHTAccountParamsDTO,
  ): Promise<InstanceType<User>> {
    const newUser = await this._userModel.create(params);
    return newUser;
  }
}

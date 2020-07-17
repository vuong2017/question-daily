import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';
import { QuestionModule } from '../question/question.module';
import { QuestionDailyController } from './question-daily.controller';
import { QuestionDaily } from './question-daily.model';
import { QuestionDailyService } from './question-daily.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionDaily.modelName, schema: QuestionDaily.model.schema },
    ]),
    UserModule,
    forwardRef(() => QuestionModule),
  ],
  controllers: [QuestionDailyController],
  providers: [QuestionDailyService],
  exports: [QuestionDailyService],
})
export class QuestionDailyModule {}

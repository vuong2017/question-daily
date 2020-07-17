import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { Question } from './question.model';
import { QuestionService } from './question.service';
import { ChoiceModule } from '../choice/choice.module';
import { QuestionDailyModule } from '../question-daily/question-daily.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.modelName, schema: Question.model.schema }]),
    ChoiceModule,
    forwardRef(() => QuestionDailyModule)
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule { }

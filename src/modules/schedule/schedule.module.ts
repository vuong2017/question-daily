import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from 'nest-schedule';

import { ScheduleService } from './schedule.service';
import { QuestionDailyModule } from '../question-daily/question-daily.module';

@Module({
  imports: [
    NestScheduleModule.register(),
    QuestionDailyModule,
  ],
  providers: [ScheduleService]
})
export class ScheduleModule {}

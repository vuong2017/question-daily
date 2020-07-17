import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';

import { QuestionDailyService } from '../question-daily/question-daily.service';

@Injectable()
export class ScheduleService extends NestSchedule {    

    constructor(private readonly _questionDailyService: QuestionDailyService) {
        super();
    }

    @Cron('30 09 * * *')
    async cronQuestions() {
        await this._questionDailyService.autoCreateQuesition();
    }
}
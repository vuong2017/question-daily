import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { QuestionModule } from '@/modules/question/question.module';
import { ChoiceModule } from '@/modules/choice/choice.module';
import { QuestionDailyModule } from '@/modules/question-daily/question-daily.module';
import { UserModule } from '@/modules/user/user.module';
import { ScheduleModule } from '@/modules/schedule/schedule.module';

@Module({
  imports: [
    AuthModule,
    QuestionModule,
    ChoiceModule,
    QuestionDailyModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        config: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ScheduleModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

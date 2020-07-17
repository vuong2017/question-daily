import { Module, HttpModule } from '@nestjs/common';
import { ChoiceController } from './choice.controller';
import { ChoiceService } from './choice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Choice } from './choice.model';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Choice.modelName, schema: Choice.model.schema },
    ]),
  ],
  controllers: [ChoiceController],
  providers: [ChoiceService],
  exports: [ChoiceService],
})
export class ChoiceModule {}

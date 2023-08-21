import { LoggerModule } from '@common/infra/logger/logger.module';
import { TimeLineModule } from '@modules/timeline/timeline.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TimeLineModule, LoggerModule],
})
export class AppModule {}

import { TimeLineModule } from '@modules/timeline/timeline.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TimeLineModule],
})
export class AppModule {}

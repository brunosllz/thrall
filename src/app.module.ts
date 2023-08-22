import { CommonInfraModule } from '@common/infra/common-infra.module';
import { TimeLineModule } from '@modules/timeline/timeline.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonInfraModule, TimeLineModule],
})
export class AppModule {}

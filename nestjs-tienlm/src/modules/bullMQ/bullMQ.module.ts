import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { queueName } from 'src/common/utils/queueName';
import { EmailModule } from '../email/email.module';
import { MailConsumer } from './email.consumer';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: queueName.MAIL }),
    EmailModule,
  ],
  providers: [MailConsumer],
  exports: [BullModule],
})
export class BullConfigModule {}

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { queueName } from 'src/common/utils/queueName';
import { EmailService } from '../email/email.service';

@Injectable()
@Processor(queueName.MAIL)
export class MailConsumer extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(job: Job<any>): Promise<void> {
    const { user, token } = job.data;
    await this.emailService.sendForgotPasswordEmail(user, token);
  }
}

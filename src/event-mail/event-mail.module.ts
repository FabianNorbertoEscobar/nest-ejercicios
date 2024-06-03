import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserDocument } from 'src/users/model/user.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Module({})
export class EventMailModule {
  constructor(private readonly mailService: MailerService) {}

  @OnEvent('user.created')
  handleUserCreatedEvent(user: UserDocument) {
    // console.log(user);
    this.mailService.sendMail({
      // to: user.email,
      to: 'fabiannorbertoescobar@gmail.com',
      from: 'mail',
      subject: 'Bienvenido a esta app de NestJS',
      template: 'welcome',
      context: {
        name: user.name,
      },
    });
  }

  @OnEvent('user.logged')
  handleUserLoggedEvent(user: UserDocument) {
    console.log(user);
  }
}

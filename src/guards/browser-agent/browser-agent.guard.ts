import {
  CanActivate,
  ExecutionContext,
  Injectable,
  /* HttpException,
  HttpStatus, */
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BrowserAgentGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.getArgByIndex(0);
    const userAgent = req.headers['user-agent'];

    console.log(userAgent);

    // const isAllowed = userAgent === 'google'
    // if (!isAllowed) throw new HttpException('BROWSER_AGENT_INVALID', HttpStatus.BAD_REQUEST)

    // return isAllowed
    return true;
  }
}

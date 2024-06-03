import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  handleRegister(@Body() registerBody: RegisterAuthDto) {
    return this.authService.register(registerBody);
  }

  @Post('login')
  handleLogin(@Body() loginBody: LoginAuthDto) {
    return this.authService.login(loginBody);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { GetCurrentUserId, Public } from './decorators';
import { AuthDto } from './dto/';
import { ATGuard } from './guards';
import { Tokens } from './interfaces';
import { Cookies } from './decorators/cookies.decorator';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @Post('signUp')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Пользователь с таким email уже существует',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не удалось создать пользователя',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при регистрации',
  })
  signUpLocal(
    @Body() authDto: AuthDto,
  ): Promise<{ tokens: Tokens; user: User } | HttpException | undefined> {
    return this.authService.signUpLocal(authDto);
  }

  @Public()
  @Post('signIn')
  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Указан неверный пароль',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при входе',
  })
  async signInLocal(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ tokens: Tokens; user: User } | HttpException> {
    const result = await this.authService.signInLocal(authDto);
    if (result instanceof HttpException) {
      throw result;
    }

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    return result;
  }

  @UseGuards(ATGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiParam({ name: 'userId', description: 'Идентификатор пользователя' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Выход из системы совершён успешно',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при выходе из системы',
  })
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Указан неверный Refresh Token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при получении токенов',
  })
  refreshTokens(@Cookies('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    return this.authService.refreshTokens(refreshToken);
  }

  @Public()
  @Get('activate/:id')
  activateUser(@Param('id') id: string) {
    return this.userService.activateUser(id);
  }
}

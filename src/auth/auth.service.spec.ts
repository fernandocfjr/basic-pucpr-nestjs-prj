import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Pick<UsersService, 'findWithPasswordByEmail'>;
  let jwtService: Pick<JwtService, 'signAsync'>;

  beforeEach(() => {
    usersService = {
      findWithPasswordByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    service = new AuthService(
      usersService as UsersService,
      jwtService as JwtService,
    );
  });

  it('returns an access token when credentials are valid', async () => {
    const passwordHash = await bcrypt.hash('strongpass', 10);
    (usersService.findWithPasswordByEmail as jest.Mock).mockResolvedValue({
      id: 'u1',
      email: 'john@site.com',
      password: passwordHash,
    });
    (jwtService.signAsync as jest.Mock).mockResolvedValue('jwt-token');

    const result = await service.login({
      email: 'john@site.com',
      password: 'strongpass',
    });

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'u1',
      email: 'john@site.com',
    });
    expect(result).toEqual({ access_token: 'jwt-token' });
  });

  it('throws UnauthorizedException when password is invalid', async () => {
    const passwordHash = await bcrypt.hash('strongpass', 10);
    (usersService.findWithPasswordByEmail as jest.Mock).mockResolvedValue({
      id: 'u1',
      email: 'john@site.com',
      password: passwordHash,
    });

    await expect(
      service.login({
        email: 'john@site.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

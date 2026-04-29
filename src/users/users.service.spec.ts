import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

type UsersRepositoryMock = {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  delete: jest.Mock;
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: UsersRepositoryMock;

  beforeEach(() => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    service = new UsersService(repo as never);
  });

  it('creates a user with hashed password and returns public fields only', async () => {
    const dto = {
      email: 'john@site.com',
      password: 'strongpass',
      name: 'John',
    };

    repo.findOne.mockResolvedValue(null);
    repo.create.mockImplementation((entity) => entity);
    repo.save.mockImplementation((entity) => ({
      id: 'user-1',
      ...entity,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    }));

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: dto.email,
        name: dto.name,
      }),
    );

    const savedPayload = repo.save.mock.calls[0][0] as User;
    expect(savedPayload.password).not.toBe(dto.password);
    expect(await bcrypt.compare(dto.password, savedPayload.password)).toBe(
      true,
    );
    expect(result).toEqual({
      id: 'user-1',
      email: dto.email,
      name: dto.name,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    expect((result as User).password).toBeUndefined();
  });

  it('throws ConflictException when creating with an existing email', async () => {
    repo.findOne.mockResolvedValue({ id: 'existing' });

    await expect(
      service.create({
        email: 'john@site.com',
        password: 'strongpass',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException when removing a missing user', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

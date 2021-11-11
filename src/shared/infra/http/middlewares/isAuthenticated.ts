import { container } from '../../ioc';
import { Request, Response } from 'express';
import { endRequest } from '../utils/endRequest';
import { IAuthService, IContext } from '../../../../modules/users/services/auth/IAuthService';
import { UniqueEntityID } from '../../../domain/UniqueEntityID';
import { UserId } from '../../../../modules/users/domain/userId';
import { IUserRepo } from '../../../../modules/users/domain/ports/IUserRepo';
import { UserMap } from '../../../../modules/users/infra/mappers/userMap';
import TYPES from '../../constants/types';

export default async (req: Request, res: Response, next: Function) => {
  const authProvider = container.get<IAuthService>(TYPES.IAuthService);
  const userRepo = container.get<IUserRepo>(TYPES.IUserRepo);

  try {
    const { authorization } = req.headers;

    if (authorization) {
      if (!authorization.startsWith('Bearer')) return endRequest(403, 'Invalid access token', res);

      const split = authorization.split('Bearer ');

      if (split.length !== 2) return endRequest(403, 'Invalid access token', res);
      const token = split[1];

      const decodedToken: IContext = await authProvider.decodeAuthToken(token);
      const userFound = await userRepo.getUserById(
        UserId.create(new UniqueEntityID(decodedToken.userId)).getValue(),
      );
      req['context'] = UserMap.toDTO(userFound);

      return next();
    } else {
      return endRequest(403, 'No access token provided', res);
    }
  } catch (error: any) {
    return endRequest(401, error.message, res);
  }
};

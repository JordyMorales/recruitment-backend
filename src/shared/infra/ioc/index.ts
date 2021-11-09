import { Container } from 'inversify';
import { FirebaseAuthService } from '../../../modules/users/services/auth/firebaseAuthService';

import { UserRepo } from '../../../modules/users/infra/adapters/userRepo';
import { CreateUser } from '../../../modules/users/useCases/createUser/createUser';
import { GetAllUsers } from '../../../modules/users/useCases/getAllUsers/getAllUsers';
import { GetUserById } from '../../../modules/users/useCases/getUserById/getUserById';
import { UpdateUser } from '../../../modules/users/useCases/updateUser/updateUser';


import TYPES from '../constants/types';

const container = new Container();

container.bind(TYPES.IAuthService).to(FirebaseAuthService).inSingletonScope();

container.bind(TYPES.IUserRepo).to(UserRepo).inSingletonScope();
container.bind<CreateUser>(TYPES.CreateUser).to(CreateUser);
container.bind<GetAllUsers>(TYPES.GetAllUsers).to(GetAllUsers);
container.bind<GetUserById>(TYPES.GetUserById).to(GetUserById);
container.bind<UpdateUser>(TYPES.UpdateUser).to(UpdateUser);

export { container };

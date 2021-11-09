import { Container } from 'inversify';
import { FirebaseAuthService } from '../../../modules/users/services/firebase/firebaseAuthService';

import { UserRepo } from '../../../modules/users/infra/adapters/userRepo';
import { CreateUser } from '../../../modules/users/useCases/createUser/createUser';
import { GetAllUsers } from '../../../modules/users/useCases/getAllUsers/getAllUsers';


import TYPES from '../constants/types';

const container = new Container();

container.bind(TYPES.IAuthService).to(FirebaseAuthService).inSingletonScope();

container.bind(TYPES.IUserRepo).to(UserRepo).inSingletonScope();
container.bind<CreateUser>(TYPES.CreateUser).to(CreateUser);
container.bind<GetAllUsers>(TYPES.GetAllUsers).to(GetAllUsers);

export { container };

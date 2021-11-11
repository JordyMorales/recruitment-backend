import { Container } from 'inversify';

// Authentication
import { FirebaseAuthService } from '../../../modules/users/services/auth/firebaseAuthService';

// Repositories
import { UserRepo } from '../../../modules/users/infra/adapters/userRepo';
import { CandidateRepo } from '../../../modules/recruitment/candidate/infra/adapters/candidateRepo';
import { EmailRepo } from '../../../modules/recruitment/candidate/infra/adapters/emailRepo';
import { PhoneRepo } from '../../../modules/recruitment/candidate/infra/adapters/phoneRepo';

// Use cases
import { CreateUser } from '../../../modules/users/useCases/createUser/createUser';
import { GetAllUsers } from '../../../modules/users/useCases/getAllUsers/getAllUsers';
import { GetUserById } from '../../../modules/users/useCases/getUserById/getUserById';
import { UpdateUser } from '../../../modules/users/useCases/updateUser/updateUser';
import { CreateCandidate } from '../../../modules/recruitment/candidate/useCases/createCandidate/createCandidate';
import { GetAllCandidates } from '../../../modules/recruitment/candidate/useCases/getAllCandidates/getAllCandidates';

import TYPES from '../constants/types';

const container = new Container();

// Authentication
container.bind(TYPES.IAuthService).to(FirebaseAuthService).inSingletonScope();

// Repositories
container.bind(TYPES.IUserRepo).to(UserRepo).inSingletonScope();
container.bind(TYPES.ICandidateRepo).to(CandidateRepo).inSingletonScope();
container.bind(TYPES.IEmailRepo).to(EmailRepo).inSingletonScope();
container.bind(TYPES.IPhoneRepo).to(PhoneRepo).inSingletonScope();

// Use cases
container.bind<CreateUser>(TYPES.CreateUser).to(CreateUser);
container.bind<GetAllUsers>(TYPES.GetAllUsers).to(GetAllUsers);
container.bind<GetUserById>(TYPES.GetUserById).to(GetUserById);
container.bind<UpdateUser>(TYPES.UpdateUser).to(UpdateUser);
container.bind<CreateCandidate>(TYPES.CreateCandidate).to(CreateCandidate);
container.bind<GetAllCandidates>(TYPES.GetAllCandidates).to(GetAllCandidates);

export { container };

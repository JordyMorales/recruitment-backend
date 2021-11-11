import { Container } from 'inversify';

// Authentication
import { FirebaseAuthService } from '../../../modules/users/services/auth/firebaseAuthService';

// Repositories
import { UserRepo } from '../../../modules/users/infra/adapters/userRepo';
import { CandidateRepo } from '../../../modules/recruitment/candidate/infra/adapters/candidateRepo';
import { EmailRepo } from '../../../modules/recruitment/candidate/infra/adapters/emailRepo';
import { PhoneRepo } from '../../../modules/recruitment/candidate/infra/adapters/phoneRepo';
import { TagRepo } from '../../../modules/recruitment/candidate/infra/adapters/tagRepo';
import { TechnologyRepo } from '../../../modules/recruitment/candidate/infra/adapters/technologyRepo';

// Use cases
import { CreateUser } from '../../../modules/users/useCases/createUser/createUser';
import { GetAllUsers } from '../../../modules/users/useCases/getAllUsers/getAllUsers';
import { GetUserById } from '../../../modules/users/useCases/getUserById/getUserById';
import { UpdateUser } from '../../../modules/users/useCases/updateUser/updateUser';
import { CreateCandidate } from '../../../modules/recruitment/candidate/useCases/createCandidate/createCandidate';
import { GetAllCandidates } from '../../../modules/recruitment/candidate/useCases/getAllCandidates/getAllCandidates';
import { GetCandidateById } from '../../../modules/recruitment/candidate/useCases/getCandidateById/GetCandidateById';
import { CreateTag } from '../../../modules/recruitment/candidate/useCases/createTag/createTag';
import { GetAllTags } from '../../../modules/recruitment/candidate/useCases/getAllTags/getAllTags';
import { SearchTags } from '../../../modules/recruitment/candidate/useCases/searchTags/searchTags';
import { UpdateTag } from '../../../modules/recruitment/candidate/useCases/updateTag/updateTag';
import { CreateTechnology } from '../../../modules/recruitment/candidate/useCases/createTechnology/createTechnology';
import { GetAllTechnologies } from '../../../modules/recruitment/candidate/useCases/getAllTechnologies/getAllTechnologies';
import { SearchTechnologies } from '../../../modules/recruitment/candidate/useCases/searchTechnologies/searchTechnologies';
import { UpdateTechnology } from '../../../modules/recruitment/candidate/useCases/updateTechnology/updateTechnology';

import TYPES from '../constants/types';

const container = new Container();

// Authentication
container.bind(TYPES.IAuthService).to(FirebaseAuthService).inSingletonScope();

// Repositories
container.bind(TYPES.IUserRepo).to(UserRepo).inSingletonScope();
container.bind(TYPES.ICandidateRepo).to(CandidateRepo).inSingletonScope();
container.bind(TYPES.IEmailRepo).to(EmailRepo).inSingletonScope();
container.bind(TYPES.IPhoneRepo).to(PhoneRepo).inSingletonScope();
container.bind(TYPES.ITagRepo).to(TagRepo).inSingletonScope();
container.bind(TYPES.ITechnologyRepo).to(TechnologyRepo).inSingletonScope();

// Use cases
container.bind<CreateUser>(TYPES.CreateUser).to(CreateUser);
container.bind<GetAllUsers>(TYPES.GetAllUsers).to(GetAllUsers);
container.bind<GetUserById>(TYPES.GetUserById).to(GetUserById);
container.bind<UpdateUser>(TYPES.UpdateUser).to(UpdateUser);
container.bind<CreateCandidate>(TYPES.CreateCandidate).to(CreateCandidate);
container.bind<GetAllCandidates>(TYPES.GetAllCandidates).to(GetAllCandidates);
container.bind<GetCandidateById>(TYPES.GetCandidateById).to(GetCandidateById);
container.bind<CreateTag>(TYPES.CreateTag).to(CreateTag);
container.bind<GetAllTags>(TYPES.GetAllTags).to(GetAllTags);
container.bind<SearchTags>(TYPES.SearchTags).to(SearchTags);
container.bind<UpdateTag>(TYPES.UpdateTag).to(UpdateTag);
container.bind<CreateTechnology>(TYPES.CreateTechnology).to(CreateTechnology);
container.bind<GetAllTechnologies>(TYPES.GetAllTechnologies).to(GetAllTechnologies);
container.bind<SearchTechnologies>(TYPES.SearchTechnologies).to(SearchTechnologies);
container.bind<UpdateTechnology>(TYPES.UpdateTechnology).to(UpdateTechnology);

export { container };

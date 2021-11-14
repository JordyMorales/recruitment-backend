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
import { CommentRepo } from '../../../modules/recruitment/candidate/infra/adapters/commentRepo';
import { ProcessRepo } from '../../../modules/recruitment/job/infra/adapters/processRepo';
import { StepRepo } from '../../../modules/recruitment/job/infra/adapters/stepRepo';
import { JobRepo } from '../../../modules/recruitment/job/infra/adapters/jobRepo';
import { ApplicationRepo } from '../../../modules/recruitment/job/infra/adapters/applicationRepo';

// Use cases
import { CreateUser } from '../../../modules/users/useCases/createUser/createUser';
import { GetAllUsers } from '../../../modules/users/useCases/getAllUsers/getAllUsers';
import { GetUserById } from '../../../modules/users/useCases/getUserById/getUserById';
import { UpdateUser } from '../../../modules/users/useCases/updateUser/updateUser';
import { CreateCandidate } from '../../../modules/recruitment/candidate/useCases/createCandidate/createCandidate';
import { GetAllCandidates } from '../../../modules/recruitment/candidate/useCases/getAllCandidates/getAllCandidates';
import { GetCandidateById } from '../../../modules/recruitment/candidate/useCases/getCandidateById/getCandidateById';
import { CreateTag } from '../../../modules/recruitment/candidate/useCases/createTag/createTag';
import { GetAllTags } from '../../../modules/recruitment/candidate/useCases/getAllTags/getAllTags';
import { SearchTags } from '../../../modules/recruitment/candidate/useCases/searchTags/searchTags';
import { UpdateTag } from '../../../modules/recruitment/candidate/useCases/updateTag/updateTag';
import { CreateTechnology } from '../../../modules/recruitment/candidate/useCases/createTechnology/createTechnology';
import { GetAllTechnologies } from '../../../modules/recruitment/candidate/useCases/getAllTechnologies/getAllTechnologies';
import { SearchTechnologies } from '../../../modules/recruitment/candidate/useCases/searchTechnologies/searchTechnologies';
import { UpdateTechnology } from '../../../modules/recruitment/candidate/useCases/updateTechnology/updateTechnology';
import { CreateComment } from '../../../modules/recruitment/candidate/useCases/createComment/createComment';
import { GetCandidateComments } from '../../../modules/recruitment/candidate/useCases/getCandidateComments/getCandidateComments';
import { CreateProcess } from '../../../modules/recruitment/job/useCases/createProcess/createProcess';
import { GetProcessById } from '../../../modules/recruitment/job/useCases/getProcessById/getProcessById';
import { UpdateProcess } from '../../../modules/recruitment/job/useCases/updateProcess/updateProcess';
import { AddStepToProcess } from '../../../modules/recruitment/job/useCases/addStepToProcess/addStepToProcess';
import { UpdateStep } from '../../../modules/recruitment/job/useCases/updateStep/updateStep';
import { GetAllProcessesSteps } from '../../../modules/recruitment/job/useCases/getAllProcessesSteps/getAllProcessesSteps';
import { CreateJob } from '../../../modules/recruitment/job/useCases/createJob/createJob';
import { UpdateJob } from '../../../modules/recruitment/job/useCases/updateJob/updateJob';
import { GetJobById } from '../../../modules/recruitment/job/useCases/getJobById/getJobById';
import { GetAllJobs } from '../../../modules/recruitment/job/useCases/getAllJobs/getAllJobs';
import { ApplyForJob } from '../../../modules/recruitment/job/useCases/applyForJob/applyForJob';
import { GetJobApplications } from '../../../modules/recruitment/job/useCases/getJobApplications/getJobApplications';
import { GetStepApplications } from '../../../modules/recruitment/job/useCases/getStepApplications/getStepApplications';
import { UpdateApplication } from '../../../modules/recruitment/job/useCases/updateApplication/updateApplication';

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
container.bind(TYPES.ICommentRepo).to(CommentRepo).inSingletonScope();
container.bind(TYPES.IProcessRepo).to(ProcessRepo).inSingletonScope();
container.bind(TYPES.IStepRepo).to(StepRepo).inSingletonScope();
container.bind(TYPES.IJobRepo).to(JobRepo).inSingletonScope();
container.bind(TYPES.IApplicationRepo).to(ApplicationRepo).inSingletonScope();

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
container.bind<CreateComment>(TYPES.CreateComment).to(CreateComment);
container.bind<GetCandidateComments>(TYPES.GetCandidateComments).to(GetCandidateComments);
container.bind<CreateProcess>(TYPES.CreateProcess).to(CreateProcess);
container.bind<GetProcessById>(TYPES.GetProcessById).to(GetProcessById);
container.bind<UpdateProcess>(TYPES.UpdateProcess).to(UpdateProcess);
container.bind<AddStepToProcess>(TYPES.AddStepToProcess).to(AddStepToProcess);
container.bind<UpdateStep>(TYPES.UpdateStep).to(UpdateStep);
container.bind<GetAllProcessesSteps>(TYPES.GetAllProcessesSteps).to(GetAllProcessesSteps);
container.bind<CreateJob>(TYPES.CreateJob).to(CreateJob);
container.bind<UpdateJob>(TYPES.UpdateJob).to(UpdateJob);
container.bind<GetJobById>(TYPES.GetJobById).to(GetJobById);
container.bind<GetAllJobs>(TYPES.GetAllJobs).to(GetAllJobs);
container.bind<ApplyForJob>(TYPES.ApplyForJob).to(ApplyForJob);
container.bind<GetJobApplications>(TYPES.GetJobApplications).to(GetJobApplications);
container.bind<GetStepApplications>(TYPES.GetStepApplications).to(GetStepApplications);
container.bind<UpdateApplication>(TYPES.UpdateApplication).to(UpdateApplication);

export { container };

const TYPES = {
  // Authentication
  IAuthService: 'IAuthService',
  Middleware: 'Middleware',
  // Repositories
  IUserRepo: 'IUserRepo',
  ICandidateRepo: 'ICandidateRepo',
  IEmailRepo: 'IEmailRepo',
  IPhoneRepo: 'IPhoneRepo',
  ITagRepo: 'ITagRepo',
  ITechnologyRepo: 'ITechnologyRepo',
  ICommentRepo: 'ICommentRepo',
  IProcessRepo: 'IProcessRepo',
  IStepRepo: 'IStepRepo',
  // Use cases
  CreateUser: 'CreateUser',
  GetAllUsers: 'GetAllUsers',
  GetUserById: 'GetUserById',
  UpdateUser: 'UpdateUser',
  CreateCandidate: 'CreateCandidate',
  GetAllCandidates: 'GetAllCandidates',
  GetCandidateById: 'GetCandidateById',
  CreateTag: 'CreateTag',
  GetAllTags: 'GetAllTags',
  SearchTags: 'SearchTags',
  UpdateTag: 'UpdateTag',
  CreateTechnology: 'CreateTechnology',
  GetAllTechnologies: 'GetAllTechnologies',
  SearchTechnologies: 'SearchTechnologies',
  UpdateTechnology: 'UpdateTechnology',
  CreateComment: 'CreateComment',
  GetCandidateComments: 'GetCandidateComments',
  CreateProcess: 'CreateProcess',
  GetProcessById: 'GetProcessById',
  UpdateProcess: 'UpdateProcess',
  AddStepToProcess: 'AddStepToProcess',
};

export default TYPES;

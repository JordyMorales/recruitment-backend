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
};

export default TYPES;

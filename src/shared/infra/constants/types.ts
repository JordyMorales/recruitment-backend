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
  // Use cases
  CreateUser: 'CreateUser',
  GetAllUsers: 'GetAllUsers',
  GetUserById: 'GetUserById',
  UpdateUser: 'UpdateUser',
  CreateCandidate: 'CreateCandidate',
  GetAllCandidates: 'GetAllCandidates',
  GetCandidateById: 'GetCandidateById',
  CreateTag: 'CreateTag',
};

export default TYPES;

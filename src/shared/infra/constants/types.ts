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
  IJobRepo: 'IJobRepo',
  IApplicationRepo: 'IApplicationRepo',
  IInterviewRepo: 'IInterviewRepo',
  IInterviewerRepo: 'IInterviewerRepo',
  IRateRepo: 'IRateRepo',
  ILinkRepo: 'ILinkRepo',
  // Use cases
  CreateUser: 'CreateUser',
  GetAllUsers: 'GetAllUsers',
  GetUserById: 'GetUserById',
  UpdateUser: 'UpdateUser',
  CreateCandidate: 'CreateCandidate',
  UpdateCandidate: 'UpdateCandidate',
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
  GetAllProcesses: 'GetAllProcesses',
  GetProcessById: 'GetProcessById',
  UpdateProcess: 'UpdateProcess',
  AddStepToProcess: 'AddStepToProcess',
  UpdateStep: 'UpdateStep',
  GetAllProcessesSteps: 'GetAllProcessesSteps',
  CreateJob: 'CreateJob',
  UpdateJob: 'UpdateJob',
  GetJobById: 'GetJobById',
  GetAllJobs: 'GetAllJobs',
  ApplyForJob: 'ApplyForJob',
  GetApplicationById: 'GetApplicationById',
  GetJobApplications: 'GetJobApplications',
  GetCandidateApplications: 'GetCandidateApplications',
  GetStepApplications: 'GetStepApplications',
  UpdateApplication: 'UpdateApplication',
  ScheduleInterview: 'ScheduleInterview',
  UpdateInterview: 'UpdateInterview',
  AssignInterviewer: 'AssignInterviewer',
  GetApplicationInterviews: 'GetApplicationInterviews',
  RateInterview: 'RateInterview',
  UpdateRate: 'UpdateRate',
  GetInterviewRatings: 'GetInterviewRatings',
};

export default TYPES;

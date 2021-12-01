import { injectable, inject } from 'inversify';
import { Tag } from './../../domain/tag';
import { Link } from '../../domain/link';
import { Email } from '../../domain/email';
import { Phone } from './../../domain/phone';
import { Technology } from './../../domain/technology';
import { Candidate, CandidateProps } from '../../domain/candidate';
import { UpdateCandidateErrors } from './updateCandidateError';
import { UpdateCandidateRequestDTO } from './updateCandidateRequestDTO';
import { ICandidateRepo } from '../../domain/ports/ICandidateRepo';
import { IEmailRepo } from '../../domain/ports/IEmailRepo';
import { IPhoneRepo } from '../../domain/ports/IPhoneRepo';
import { ILinkRepo } from './../../domain/ports/ILinkRepo';
import { UserMap } from '../../../../users/infra/mappers/userMap';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import { CandidateId } from '../../domain/candidateId';
import TYPES from '../../../../../shared/infra/constants/types';
import { UserId } from '../../../../users/domain/userId';
import { IUserRepo } from '../../../../users/domain/ports/IUserRepo';

export type Response = Either<
  | UpdateCandidateErrors.UserNotFoundError
  | UpdateCandidateErrors.CandidateNotFoundError
  | UpdateCandidateErrors.EmailAlreadyExistsError
  | UpdateCandidateErrors.PhoneAlreadyExistsError
  | AppError.UnexpectedError,
  Result<Candidate>
>;

@injectable()
export class UpdateCandidate implements UseCase<UpdateCandidateRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.ICandidateRepo) private candidateRepo: ICandidateRepo,
    @inject(TYPES.IUserRepo) private userRepo: IUserRepo,
    @inject(TYPES.ILinkRepo) private linkRepo: ILinkRepo,
    @inject(TYPES.IEmailRepo) private emailRepo: IEmailRepo,
    @inject(TYPES.IPhoneRepo) private phoneRepo: IPhoneRepo,
  ) {}

  private tagsToDomain(tags: any[]): Tag[] {
    return tags.map(({ tagId, name, color }) => {
      const tagOrError: Result<Tag> = Tag.create({ name, color }, tagId);
      if (tagOrError.isSuccess) return tagOrError.getValue();
    });
  }
  private technologiesToDomain(technologies: any[]): Technology[] {
    return technologies.map(({ technologyId, name }) => {
      const technologyOrError: Result<Technology> = Technology.create({ name }, technologyId);
      if (technologyOrError.isSuccess) return technologyOrError.getValue();
    });
  }

  public async execute(request: UpdateCandidateRequestDTO): Promise<Response> {
    try {
      const userId = UserId.create(new UniqueEntityID(request.userId)).getValue();
      const userFound = await this.userRepo.getUserById(userId);
      const userExists = !!userFound === true;

      if (!userExists) {
        return left(new UpdateCandidateErrors.UserNotFoundError(request.userId)) as Response;
      }

      let candidateFound: Candidate;
      const candidateId = CandidateId.create(new UniqueEntityID(request.userId)).getValue();

      try {
        candidateFound = await this.candidateRepo.getCandidateById(candidateId);
      } catch (error) {
        return left(new UpdateCandidateErrors.CandidateNotFoundError(request.userId));
      }

      let links: Link[] = [];
      let emails: Email[] = [];
      let phones: Phone[] = [];

      if (request.hasOwnProperty('links')) {
        for (let index = 0; index < request.links.length; index++) {
          const link = request.links[index];
          const linkFound = await this.linkRepo.getLink(link);
          if (!!linkFound === false) {
            const linkOrError = Link.create({ value: link, candidateId });
            if (linkOrError.isFailure) return left(linkOrError) as Response;
            links.push(linkOrError.getValue());
            break;
          }
          links.push(linkFound);
        }
      }

      if (request.hasOwnProperty('emails')) {
        for (let index = 0; index < request.emails.length; index++) {
          const email = request.emails[index];
          const emailFound = await this.emailRepo.getEmail(email);
          if (!!emailFound === false) {
            const emailOrError = Email.create({ value: email, candidateId });
            if (emailOrError.isFailure) return left(emailOrError) as Response;
            emails.push(emailOrError.getValue());
            break;
          }
          if (emailFound.candidateId.id.toString() !== request.userId)
            return left(new UpdateCandidateErrors.EmailAlreadyExistsError(email)) as Response;

          emails.push(emailFound);
        }
      }

      if (request.hasOwnProperty('phones')) {
        for (let index = 0; index < request.phones.length; index++) {
          const phone = request.phones[index];
          const phoneFound = await this.phoneRepo.getPhone(phone);
          if (!!phoneFound === false) {
            const phoneOrError = Phone.create({ value: phone, candidateId });
            if (phoneOrError.isFailure) return left(phoneOrError) as Response;
            phones.push(phoneOrError.getValue());
            break;
          }
          if (phoneFound.candidateId.id.toString() !== request.userId)
            return left(new UpdateCandidateErrors.PhoneAlreadyExistsError(phone)) as Response;
          phones.push(phoneFound);
        }
      }

      const candidateProps: CandidateProps = {
        ...candidateFound.props,
        ...request,
        tags: request.tags ? this.tagsToDomain(request.tags) : [],
        technologies: request.technologies ? this.technologiesToDomain(request.technologies) : [],
        referralBy: request.referralBy ? UserMap.toDomain(request.referralBy) : null,
        createdBy: candidateFound.createdBy,
        updatedBy: UserMap.dtoToDomain(request.updatedBy),
        updatedAt: new Date(),
        personalData: userFound,
        links,
        emails,
        phones,
      };

      const candidateOrError = Candidate.create(candidateProps, new UniqueEntityID(request.userId));

      if (candidateOrError.isFailure) {
        return left(Result.fail(candidateOrError.error.toString()));
      }
      const candidate: Candidate = candidateOrError.getValue();

      await this.candidateRepo.update(candidate);

      return right(Result.ok<Candidate>(candidate));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}

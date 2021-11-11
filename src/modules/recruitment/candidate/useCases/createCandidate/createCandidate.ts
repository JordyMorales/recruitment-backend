import { injectable, inject } from 'inversify';
import { Tag } from './../../domain/tag';
import { Link } from '../../domain/link';
import { Email } from '../../domain/email';
import { Phone } from './../../domain/phone';
import { Technology } from './../../domain/technology';
import { UserId } from '../../../../users/domain/userId';
import { Candidate, CandidateProps } from '../../domain/candidate';
import { CreateCandidateErrors } from './createCandidateErrors';
import { CreateCandidateRequestDTO } from './createCandidateRequestDTO';
import { ICandidateRepo } from '../../domain/ports/ICandidateRepo';
import { IUserRepo } from '../../../../users/domain/ports/IUserRepo';
import { IEmailRepo } from '../../domain/ports/IEmailRepo';
import { IPhoneRepo } from '../../domain/ports/IPhoneRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>;

@injectable()
export class CreateCandidate implements UseCase<CreateCandidateRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.ICandidateRepo) private candidateRepo: ICandidateRepo,
    @inject(TYPES.IUserRepo) private userRepo: IUserRepo,
    @inject(TYPES.IEmailRepo) private emailRepo: IEmailRepo,
    @inject(TYPES.IPhoneRepo) private phoneRepo: IPhoneRepo,
  ) {}
  private linksToDomain(links: any[]): Link[] {
    return links.map((link) => {
      const linkOrError: Result<Link> = Link.create({ value: link });
      if (linkOrError.isSuccess) return linkOrError.getValue();
    });
  }
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

  public async execute(request?: CreateCandidateRequestDTO): Promise<Response> {
    try {
      const userId = UserId.create(new UniqueEntityID(request.userId)).getValue();
      const userFound = await this.userRepo.getUserById(userId);
      const userExists = !!userFound === true;

      if (!userExists) {
        return left(new CreateCandidateErrors.UserNotFoundError(request.userId)) as Response;
      }

      const candidateExists = await this.candidateRepo.exists(userId);
      if (candidateExists) {
        return left(new CreateCandidateErrors.CandidateAlreadyExistsError()) as Response;
      }

      let emails: Email[] = [];
      let phones: Phone[] = [];
      if (request.hasOwnProperty('emails')) {
        for (let index = 0; index < request.emails.length; index++) {
          const email = request.emails[index];
          const emailAlreadyExists = await this.emailRepo.exists(email);
          if (emailAlreadyExists)
            return left(new CreateCandidateErrors.EmailAlreadyExistsError(email)) as Response;
          const emailOrError = Email.create({ value: email });
          if (emailOrError.isFailure) return left(emailOrError) as Response;
          emails.push(emailOrError.getValue());
        }
      }

      if (request.hasOwnProperty('phones')) {
        for (let index = 0; index < request.phones.length; index++) {
          const phone = request.phones[index];
          const phoneAlreadyExists = await this.phoneRepo.exists(phone);
          if (phoneAlreadyExists)
            return left(new CreateCandidateErrors.PhoneAlreadyExistsError(phone)) as Response;
          const phoneOrError = Phone.create({ value: phone });
          if (phoneOrError.isFailure) return left(phoneOrError) as Response;
          phones.push(phoneOrError.getValue());
        }
      }

      const candidateProps: CandidateProps = {
        ...request,
        links: request.links ? this.linksToDomain(request.links) : [],
        tags: request.tags ? this.tagsToDomain(request.tags) : [],
        technologies: request.technologies ? this.technologiesToDomain(request.technologies) : [],

        referral: request.referral ? UserId.create(new UniqueEntityID(request.referral)).getValue() : null,
        createdAt: request.createdAt ? request.createdAt : new Date(),
        createdBy: request.createdBy ? UserId.create(new UniqueEntityID(request.createdBy)).getValue() : null,
        emails,
        phones,
      };

      const candidateOrError = Candidate.create(candidateProps, new UniqueEntityID(request.userId));

      if (candidateOrError.isFailure) {
        return left(candidateOrError);
      }
      const candidate: Candidate = candidateOrError.getValue();

      await this.candidateRepo.save(candidate);

      return right(Result.ok<void>());
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}

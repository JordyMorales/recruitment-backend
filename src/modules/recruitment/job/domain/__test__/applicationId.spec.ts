import { ApplicationId } from '../applicationId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let applicationId: ApplicationId;
let applicationIdOrError: Result<ApplicationId>;

test('Should be able to create a applicationId', () => {
  applicationIdOrError = ApplicationId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(applicationIdOrError.isSuccess).toBe(true);
  applicationId = applicationIdOrError.getValue();
  expect(applicationId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});

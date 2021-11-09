import generator from 'generate-password';
import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

export interface IUserPasswordProps {
  value: string;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
  private static isAppropriateLength(password: string): boolean {
    const regExp = /^(?=.{6,}$)/;
    return regExp.test(password);
  }

  private static containsADigit(password: string): boolean {
    const regExp = /^(?=.*[0-9])/;
    return regExp.test(password);
  }

  private static containsLowercaseLetter(password: string): boolean {
    const regExp = /^(?=.*[a-z])/;
    return regExp.test(password);
  }

  private static containsUppercaseLetter(password: string): boolean {
    const regExp = /^(?=.*[A-Z])/;
    return regExp.test(password);
  }

  private static containsNonAlphanumericCharacter(password: string): boolean {
    const regExp = /^(?=.*[\u0021-\u002b\u003c-\u0040])/;
    return regExp.test(password);
  }

  private constructor(props: IUserPasswordProps) {
    super(props);
  }

  public static create(password: string): Result<UserPassword> {
    const propsResult = Guard.againstNullOrUndefined(password, 'password');

    if (!propsResult.succeeded) {
      return Result.fail<UserPassword>(propsResult.message);
    } else {
      if (!this.isAppropriateLength(password)) {
        return Result.fail<UserPassword>("Password doesn't meet criteria [6 chars min].");
      }
      if (!this.containsADigit(password)) {
        return Result.fail<UserPassword>("Password doesn't meet criteria [1 digit min].");
      }
      if (!this.containsLowercaseLetter(password)) {
        return Result.fail<UserPassword>("Password doesn't meet criteria [1 lowercase letter min].");
      }
      if (!this.containsUppercaseLetter(password)) {
        return Result.fail<UserPassword>("Password doesn't meet criteria [1 uppercase letter min].");
      }
      if (!this.containsNonAlphanumericCharacter(password)) {
        return Result.fail<UserPassword>(
          "Password doesn't meet criteria [1 non-alphanumeric character min].",
        );
      }

      return Result.ok<UserPassword>(new UserPassword({ value: password }));
    }
  }
}

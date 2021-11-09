import validator from 'validator';
import generator from 'generate-password';

export class TextUtils {
  public static validateWebURL(url: string): boolean {
    return validator.isURL(url);
  }

  public static validateEmailAddress(email: string): boolean {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public static generatePassword(): string {
    return generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      strict: true,
    });
  }
}

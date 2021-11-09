import { TextUtils } from './TextUtils';

test('Should be able to create a user', () => {
  expect(TextUtils.validateWebURL('http://www.google.com')).toBe(true);
  expect(TextUtils.validateEmailAddress('jordy.morales@nearshorecode.com')).toBe(true);
});

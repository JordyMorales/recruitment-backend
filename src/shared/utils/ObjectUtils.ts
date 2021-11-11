export const removeNullProperties = (object) => {
  Object.keys(object).forEach((key) => {
    let value = object[key];
    let hasProperties = value && Object.keys(value).length > 0;
    if (value === null) {
      delete object[key];
    } else if (typeof value !== 'string' && hasProperties) {
      removeNullProperties(value);
    }
  });
  return object;
};

/**
 * If the ISBN matches the regular expression, return true, otherwise return false.
 * @param isbn - The ISBN to validate.
 * @returns A boolean value.
 */
const validateISBN = (isbn) => {
  const regex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
  const result = isbn.match(regex);
  return result !== null;
};

/**
 * It returns true if the date is in the format dd.mm.yyyy, and false otherwise
 * @param date - The date to validate.
 * @returns A boolean value.
 */
const validateDate = (date) => {
  const regex = /^(0[1-9]|1\d|2\d|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
  const result = date.match(regex);
  return result !== null;
};

/**
 * It checks if the email is a valid email address
 * @param email - The email address to validate
 */
const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    const error = new Error('Email must be valid email address');
    error.status = 422;
    throw error;
  }
  return true;
};

/**
 * Return true if the value is the first instance of that value in the array.
 * @param value - The current element being processed in the array.
 * @param index - The current index of the value in the array.
 * @param self - The array that the filter method was called on.
 * @returns The index of the first occurrence of the value in the array.
 */
const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

module.exports = { validateISBN, validateEmail, validateDate, unique };

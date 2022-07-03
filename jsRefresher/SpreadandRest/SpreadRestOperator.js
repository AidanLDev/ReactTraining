// Spread operator examples
const oneToEight = [1, 2, 3, 4, 5, 6, 7, 8];
// Using the spread operator to copy the values from the first array
const oneToTen = [...oneToEight, 9, 10];

const head = {
  hair: 'dark brown',
  eyes: 'blue',
  facialHair: 'mustache',
};
// Using the spread operator in an object
const person = {
  ...head,
  height: 174,
  feet: 'UK 8',
};

// Rest operator example
const filter = (...args) => {
  // ...args turns arguments passed to the function into an array, so we can use methods like .filter(), .sort() etc etc
  return args.filter((el) => el === true);
};

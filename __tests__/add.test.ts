import { addNumbers } from '../2-primitives/add';

test('Add two positive numbers', () => {
  expect(addNumbers(3, 7)).toBe(10);
});

// test('Add a positive and a negative number', () => {
//   expect(addNumbers(5, -2)).toBe(3);
// });

// test('Add two negative numbers', () => {
//   expect(addNumbers(-8, -4)).toBe(-12);
// });

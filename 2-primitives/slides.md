# Primitive Types

TypeScript primitives are the most basic building blocks of the TypeScript type system. They represent simple, immutable values

There's a chapter on them in the TypeScript handbook: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

---

## Basic TypeScript Primitives:

- number: Represents numeric values, including integers and floating-point numbers.
- string: Represents textual data enclosed in single or double quotes.
- boolean: Represents a binary value, either true or false.
- null: Represents the intentional absence of any value or object.
- undefined: Represents a variable that has been declared but hasn't been assigned a value.
- symbol: Represents a unique and immutable value often used as object property keys.

--- 

## Type Inference for Primitives:

TypeScript often infers the types of primitives based on their initial values. For example, if you declare 

```ts
const age = 30;
```

TypeScript infers age as a number.

--- 

## Type Annotations for Primitives:

You can explicitly specify the type of a variable using type annotations. For example, 

```ts
const name: string = "John";
```

--- 

## Type Aliases:

You can create custom type aliases using type to make your code more readable. For example, 

```ts
type Age = number;
```
 
allows you to use `Age` instead of number for clarity.

--- 

## Union Types:

You can define a variable that can hold multiple types using union types. For instance, 

```ts
let result: number | string; 
```

allows `result` to be either a number or a string.

--- 

## Literal Types:

TypeScript supports literal types, where a variable can only have a specific literal value. For example, 
```ts
const something: 'x' | 'y' = 'y';
```

--- 

## Type Assertions:
Let's say you're working with data from an external source, like a user input from a web form, and TypeScript can't infer the type correctly:

```ts
let userInput: any = "42";
let parsedNumber: number = userInput; // TypeScript error: Type 'any' is not assignable to type 'number'.
```

In this case, TypeScript doesn't know that userInput is intended to be a number. To handle this situation, you might use a type assertion to tell TypeScript that you are certain it's a number:

```ts
let userInput: any = "42";
let parsedNumber: number = userInput as number; // No TypeScript error.
```
So we are using a type assertion (userInput as number) to let TypeScript know that you're treating userInput as a number. This can be necessary when dealing with data from external sources where TypeScript can't perform type inference accurately, or when you're working with dynamic data that might have varying types.

Sometimes, you may need to tell TypeScript that you know more about a value's type than it does. You can use type assertions for this purpose. For example, 

For example, you might have a variable of type any or a complex type that TypeScript can't infer correctly, and you want to treat it as a more specific type temporarily. By using type assertion, you effectively cast or convert the data to the desired type, which can be useful in scenarios where you are confident about the data's type, and you want to avoid type-checking errors.

// @ts-expect-error
```ts
(someValue as string).toUpperCase().
```


```ts
let someValue: any = "Hello, TypeScript!";

// Using a type assertion to tell TypeScript that someValue is a string
let strLength: number = (someValue as string).length;

console.log(strLength); // Output: 17
```
<!-- Reader notes
Pleae Note:   we want to recommend doing this sparingly, and only when there are no clear alternatives.
Using type assertion to tell the TypeScript compiler that you are certain that someValue is of type string. This allows you to call the toUpperCase() method on it without a compilation error. However, there are potential dangers and issues associated with this approach:
 -->
 Lack of Type Safety: By using type assertions, you bypass TypeScript's static type checking, which is one of the main benefits of using TypeScript. It means that you lose the protection TypeScript provides in terms of type safety. If someValue is supposed to be a string but isn't, you won't get any warnings or errors at compile time.

```ts
function isString(value: any): value is string {
  return typeof value === "string";
}

if (isString(someValue)) {
  const upperCaseValue = someValue.toUpperCase();
  } 
  else {
  // Handle the case where someValue is not a string
  }
```
This way, you maintain type safety, have better runtime error handling, and make your code more resilient to changes.
--- 

## Type Guards:

Type guards are functions that help narrow down the type of a value within a conditional block. For instance,

```ts
if (typeof value === 'string') { /* value is a string here */ }.
```
This will be delved deeper in session 4 however.
--- 

## Advanced Primitives:

TypeScript also supports other advanced primitive types like bigint for arbitrary-precision integers, void for functions that don't return a value, and never for functions that never return (e.g., throw errors).

#### BigInt
BigInt is used to represent arbitrarily large integers. It's useful when you need to work with integers larger than the maximum safe integer value in JavaScript, which is Number.MAX_SAFE_INTEGER.

```ts
let bigNumber: bigint = 1234567890123456789012345678901234567890n;
```

#### Void:
The void type is typically used for functions that do not return a value or return undefined. This is often the case for functions with side effects but no meaningful return value.

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

In this example, the throwError function never returns a value because it always throws an error, preventing the program from continuing.

#### Never:
The never type represents values that never occur. It is often used for functions that always throw an error or never reach the end.

Real-World Scenario 1: Throwing Errors

Suppose you have a function that's expected to throw an error in exceptional circumstances. This function should have a return type of never because it never normally returns:

```ts
function throwError(message: string): never {
  throw new Error(message);
}
```
In this scenario, never conveys the intention that the function never completes normally, as it always throws an error, preventing the program from continuing.

Real-World Scenario 2: Exhaustive Checks in TypeScript

When working with TypeScript and union types, you might want to ensure that you've handled all possible cases in a type-checking scenario. The never type can help you achieve this by indicating that a specific branch of code should never be reached.

```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

type Shape = 'circle' | 'square' | 'triangle';

function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI;
    case 'square':
      return 4;
    case 'triangle':
      return 3;
    default:
      assertNever(shape); // This ensures all cases are handled
  }
}
```
In this case, assertNever has a return type of never because it's used to indicate that a specific branch should never be reached, providing type safety in exhaustive checks.

---

### Type Inference with Functions:

TypeScript infers the return type of functions based on their implementation. Explicitly annotating return types is often not required.

TypeScript infers the return type of this function

```ts
function add(a: number, b: number) {
  return a + b;
}
```


The return type of the function 'add' is inferred as 'number'

```ts
const result = add(5, 3); // result is of type 'number'
```

In the example above:

The add function takes two parameters, a and b, both of type number.

TypeScript uses type inference to determine that the return type of the add function is number because it's clear that the function returns the sum of two numbers.

When we call add(5, 3), TypeScript knows that the result will be a number because the add function returns a number, and it infers the type for the result variable accordingly.

---
Example of use:

```ts

type AlbumName = string;

type Album = {
  name: AlbumName
  copiesSold: number
};

const albumName: AlbumName = 'Kind of Blue';
albumName;
```

---

#### Task
You are building a user profile system for a website, and you have an incomplete TypeScript type definition for the User object. Your task is to complete the type definition and implement a type guard to handle user objects with potentially unknown properties.

```ts
type User = {
  id: number;
  name: string;
  email: string;
  // Add missing type properties here
};

function isCompleteUser(user: unknown): user is User {
  // Implement a type guard to check if the user object is of type User
  // Make sure to validate that the required properties (id, name, email) are present and have the correct types.
  // You may also handle additional properties as needed.
}

const user: unknown = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  // Complete the user object with additional properties
};

if (isCompleteUser(user)) {
  // You can safely access user properties here
  console.log(`User ID: ${user.id}`);
  console.log(`User Name: ${user.name}`);
  console.log(`User Email: ${user.email}`);
  // Access other properties as needed
} else {
  console.log("Incomplete user profile. Please fill in the missing properties.");
}
```

---
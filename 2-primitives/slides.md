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

## Enums:

Enums allow you to define a set of named constants. For example:

```ts
enum Color {
  Red,
  Green,
  Blue,
}
let myColor: Color = Color.Red;
```

--- 

## Type Assertions:

Sometimes, you may need to tell TypeScript that you know more about a value's type than it does. You can use type assertions for this purpose. For example, 

// @ts-expect-error
```ts
(someValue as string).toUpperCase().
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
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

--- 

## Advanced Primitives:

TypeScript also supports other advanced primitive types like bigint for arbitrary-precision integers, void for functions that don't return a value, and never for functions that never return (e.g., throw errors).

---

### Type Inference with Functions:

TypeScript infers the return type of functions based on their implementation. Explicitly annotating return types is often not required.

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
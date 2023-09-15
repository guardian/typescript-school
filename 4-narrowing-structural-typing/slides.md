# Narrowing and Structural Typing

There's a chapter covering narrowing in the TypeScript handbook: https://www.typescriptlang.org/docs/handbook/2/narrowing.html

There's also a brief section describing structural typing: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system

## `padLeft`

Here is an example of a function that adds padding to the left of a given input `string`. If padding is passed as a `number`, that number of blank spaces will be added to the left of the input. If padding is passed as a `string`, that will be concatenated onto the front of the input instead.

```ts
const padLeft = (padding: number | string, input: string): string => ???
```

## A `padLeft` Implementation

To implement the "spaces" functionality you can repeat a `string` containing a single blank space `padding` number of times, and then add it onto the front of the `input`.

```ts
const padLeft = (padding: number | string, input: string): string =>
    " ".repeat(padding) + input;
```

However, this results in a type error, referring specifically to the argument that's been passed to the `repeat` method:

```
Argument of type 'string | number' is not assignable to parameter of type 'number'.
  Type 'string' is not assignable to type 'number'.
```

`repeat` takes a `number`, but sometimes `padding` can be a `string`, so this doesn't work.

## `typeof`

In order to use `repeat`, it's necessary to first check that `padding` is a `number`.

```ts
const padLeft = (padding: number | string, input: string): string => {
    if (typeof padding === 'number') {
        return " ".repeat(padding) + input;
    }
}
```

`typeof` is not special TypeScript syntax. It's part of JavaScript, and for any value will return one of the following strings:

- `'boolean'`
- `'number'`
- `'string'`
- `'undefined'`
- `'object'`
- `'function'`
- `'bigint'`
- `'symbol'`

More information about how it works can be found on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof

## `typeof` Narrowing

In this example, when applied to `padding`, `typeof` should return either `'string'` or `'number'`.

```ts
const padLeft = (padding: number | string, input: string): string => {
    if (typeof padding === 'number') {
        return " ".repeat(padding) + input;
    }
}
```

Even though this is a JavaScript feature, and won't actually be applied until the code runs, TypeScript can still make use of it. TypeScript knows that if this condition is `true`, then when we're inside the `if` block `padding` will definitely be a `number`. Therefore, for any code inside this block, it's able to **narrow** the type of `padding` from `number | string` to `number`.

> **Note**: Going from a general type to a more specific one is known as "narrowing"; going from a specific type to a more general one is known as "widening".

## Return Types

As the type of `padding` inside the `if` block is now `number`, there is no longer a type error related to the use of `repeat`.

```ts
const padLeft = (padding: number | string, input: string): string => {
    if (typeof padding === 'number') {
        return " ".repeat(padding) + input;
    }
}
```

However, there is now a final error related to the return type of the function.

```
Function lacks ending return statement and return type does not include 'undefined'.
```

Put another way, this is saying the function has a return type of `string`, but there are some code paths that don't include a `return` statement. In JavaScript, when a `return` statement is missing then `undefined` is implicitly returned. In the example above, this is happening whenever the `if` condition is `false`, as there's no `else` block.

## `padLeft` Complete

There are two ways to address a type error related to implicitly returning functions: either add `undefined` to the return type of the function, or make sure all code paths explicitly return something. In this case the function type is correct, so the solution is to handle the case when `padding` is not a `number`.

```ts
const padLeft = (padding: number | string, input: string): string => {
    if (typeof padding === 'number') {
        return " ".repeat(padding) + input;
    }

    return padding + input;
}
```

For this final `return` statement TypeScript is once again able to perform some narrowing. It knows that if `padding` were a `number` then the above condition would be `true`, and the function would have returned in the body of the `if` block. Therefore if the code has reached this final `return` statement then `padding` is definitely *not* a `number`, and therefore must be a `string`.

## Return Types

```ts
const padLeft = (padding: number | string, input: string) => {
    if (typeof padding === 'number') {
        return " ".repeat(padding) + input;
    }
}
```

> **Note:** `noImplicitReturns`

## Type-Driven Development

Test-driven development advocates for constructing tests to describe a problem or API, and then using these as a guide for writing the implementation.

Having TypeScript, or any type-checker, available can offer something similar. Often it can be helpful to first model a problem with types, and then use the compiler as a guide to writing the implementation.

This is sometimes referred to as "type-driven development".

To take `padLeft` as an example, defining the type up front allowed the compiler to hint that the implementation wasn't complete, and that a final `return` statement was needed.

## Type Guards

Checks like `typeof padding === 'number'` are known as "type guards".

## Equality

## `null` and `undefined`

## `instanceof`

## `in`

## Discriminated Unions

## Exhaustiveness Checking

Scala pattern matching

Function return types are important

## Type Predicates?

## Structural Typing

Don't have to consider it too often, but it's a useful feature. Different to Scala.

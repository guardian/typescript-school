# Narrowing and Structural Typing

There's a chapter covering narrowing in the TypeScript handbook: https://www.typescriptlang.org/docs/handbook/2/narrowing.html

There's also a brief section describing structural typing: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system

---

## `padLeft`

Here is an example of a function that adds padding to the left of a given input `string`. If padding is passed as a `number`, that number of blank spaces will be added to the left of the input. If padding is passed as a `string`, that will be concatenated onto the front of the input instead.

```ts
const padLeft = (padding: number | string, input: string): string => ???
```

---

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

---

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

---

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

---

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

---

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

For this final `return` statement TypeScript is again able to perform some narrowing. It knows that if `padding` were a `number` then the above condition would be `true`, and the function would have returned in the body of the `if` block. Therefore if the code has reached this final `return` statement then `padding` is definitely *not* a `number`, and therefore must be a `string`.

---

## Return Types

Adding return types to functions can better capture their intended behaviour and prevent bugs. In this case, without the `string` return type the compiler implicitly gives this function a return type of `string | undefined`. This doesn't match its intent, which is to always return a padded `string`.

```ts
const padLeft = (padding: number | string, input: string) => {
    if (typeof padding === 'number') {
        return " ".repeat(padding) + input;
    }
}
```

> **Note:** There is a compiler option called `noImplicitReturns` that will produce a compiler error whenever a function has code paths that result in an implicit `return` statement: https://www.typescriptlang.org/tsconfig#noImplicitReturns

---

## Type-Driven Development

Test-driven development advocates for constructing tests to describe a problem or API, and then using these as a guide for writing the implementation.

Having TypeScript, or any type-checker, available can offer something similar. The idea is first to model a problem with types, and then use the compiler as a guide when writing the implementation.

This is sometimes referred to as **type-driven development**.

To take `padLeft` from above as an example: defining the type up front allowed the compiler to hint that the partial implementation for `number` padding wasn't enough, and that a final `return` statement to handle the `string` case was needed to complete the function.

---

## Type Guards

Checks like `typeof padding === 'number'` are known as "type guards". They allow TypeScript to keep track of what types a value is allowed to have at different points in the code.

```ts
const logMessage = (error: string | number | object): string => {
    if (typeof error === 'string') {
        return `Error with message: ${error}`;
    } else if (typeof error === 'number') {
        return `Error with error code: ${error}`;
    } else if (typeof error === 'object') {
        return `Error with data: ${error}`;
    }
}
```

These type guards are not limited to `typeof`; there are several kinds that TypeScript can use to derive the type of a value.

---

## Pillars

In this example, functions exist to get colours for either one of the four pillars, or one of the two special themes. `headlineColour`, however, takes a `Theme`, which is too wide to be used in either of those functions as it can be any one of six values: the pillars or the special themes.

```ts
type Pillar = 'News' | 'Opinion' | 'Sport' | 'Lifestyle';
type Special = 'SpecialReport' | 'Labs';
type Theme = Pillar | Special;

const pillarColour = (pillar: Pillar): string => 'red';

const headlineColour = (theme: Theme): string => pillarColour(theme);
```

Attempting to use one of the colour functions, in this case `pillarColour`, results in an error:

```
Argument of type 'Theme' is not assignable to parameter of type 'Pillar'.
  Type '"SpecialReport"' is not assignable to type 'Pillar'.
```

`Theme` can include `SpecialReport`, which is not one of the `Pillar`s that `pillarColour` accepts.

---

## Equality Type Guards

In this case an equality check, comparing two values to one another, can be used to narrow the type of `theme`.

```ts
type Pillar = 'News' | 'Opinion' | 'Sport' | 'Lifestyle';
type Special = 'SpecialReport' | 'Labs';
type Theme = Pillar | Special;

const pillarColour = (pillar: Pillar): string => 'red';

const headlineColour = (theme: Theme): string => {
    switch (theme) {
        case 'News':
        case 'Opinion':
        case 'Sport':
        case 'Lifestyle':
            return pillarColour(theme);
        case 'SpecialReport':
        case 'Labs':
            return 'grey';
    }
}
```

A `switch` statement works just like an `if` statement to narrow the type. The `case` statements mean `theme` can only be one of the four pillars when `pillarColour` is called.

---

## Making Changes

One of the points made in session 1 was that TypeScript's value increases as a project scales, because the compiler can help you to understand how making changes will affect an existing codebase. A small example of this can be seen if the previously missing `'Culture'` is added to `Pillar`.

```ts
type Pillar = 'News' | 'Opinion' | 'Sport' | 'Lifestyle' | 'Culture';
```

---

## Exhaustiveness Checking

```ts
const headlineColour = (theme: Theme): string => {
    switch (theme) {
        case 'News':
        case 'Opinion':
        case 'Sport':
        case 'Lifestyle':
            return pillarColour(theme);
        case 'SpecialReport':
        case 'Labs':
            return 'grey';
    }
}
```

As the function has an explicit return type TypeScript again gives the following error, because the `switch` statement does not handle the `Culture` case, and so the function is implicitly returning `undefined`:

```
Function lacks ending return statement and return type does not include 'undefined'.
```

This can be fixed by adding `Culture` to the list of `case`s. In a large codebase changing a widely used type like `Pillar` can have far-reaching consequences. TypeScript is able to guide you through the change by surfacing any problems as type errors.

---

## `default` Cases

It's common to use `switch` statements when working with unions or enums, and these can include a `default` case. In the previous example, `default` might have been used to capture the `Special` cases, once the pillars had been handled.

```ts
const pillarColour = (pillar: Pillar): string => 'red';

const headlineColour = (theme: Theme): string => {
    switch (theme) {
        case 'News':
        case 'Opinion':
        case 'Sport':
        case 'Lifestyle':
            return pillarColour(theme);
        default:
            return 'grey';
    }
}
```

However, doing this will hide the consequences of adding `'Culture'` to `Pillar`. That change will no longer result in a type error, because the `default` case will handle `'Culture'`. This is problably not correct, as it will return `'grey'` rather than `'red'` like the other pillars. Sometimes it's preferable to be explicit and avoid this kind of general matching, as it limits how much help the compiler can provide.

---

## `null` and `undefined`

It's common in TypeScript codebases to have types that include `null` or `undefined`. Equality type guards can be used to check for this.

```ts
const element: HTMLElement | null = document.getElementById('element');

if (element !== null) {
    console.log(element.textContent);
}
```

---

## Implicit Truthiness

JavaScript has the ability to implicitly convert many values to `true` or `false` when used in a context where a boolean is expected.

```ts
const element: HTMLElement | null = document.getElementById('element');

if (element) {
    console.log(element.textContent);
}
```

TypeScript is able to understand this, and will narrow the type as though an explicit check had been provided.

---

## Unexpected Implicit Truthiness

Relying on implicit behaviour can lead to unexpected results. In this case a function is meant to check for the presence of a number, and provide a fallback if it's missing.

```ts
const getNumberOrFallback = (num?: number): number => {
    if (num) {
        return num;
    } else {
        return 5;
    }
}
```

However, passing `0` to this function results in the fallback `5`, because JavaScript implicitly converts `0` to `false`.

---

## Explicit Truthiness

It may be preferable to be explicit in type guards.

```ts
const getNumberOrFallback = (num?: number): number => {
    if (num !== undefined) {
        return num;
    } else {
        return 5;
    }
}
```

Calling this function with `0` will result in `0` being returned.

---

## `instanceof`

## Discriminated Unions

## Structural Typing

Don't have to consider it too often, but it's a useful feature. Different to Scala.

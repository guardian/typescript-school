# Narrowing

There's a chapter covering narrowing in the TypeScript handbook: https://www.typescriptlang.org/docs/handbook/2/narrowing.html

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
	' '.repeat(padding) + input;
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
		return ' '.repeat(padding) + input;
	}
};
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
		return ' '.repeat(padding) + input;
	}
};
```

Even though this is a JavaScript feature, and won't actually be applied until the code runs, TypeScript can still make use of it. TypeScript knows that if this condition is `true`, then when we're inside the `if` block `padding` will definitely be a `number`. Therefore, for any code inside this block, it's able to **narrow** the type of `padding` from `number | string` to `number`.

> **Note**: Going from a general type to a more specific one is known as "narrowing"; going from a specific type to a more general one is known as "widening".

---

## Return Types

As the type of `padding` inside the `if` block is now `number`, there is no longer a type error related to the use of `repeat`.

```ts
const padLeft = (padding: number | string, input: string): string => {
	if (typeof padding === 'number') {
		return ' '.repeat(padding) + input;
	}
};
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
		return ' '.repeat(padding) + input;
	}

	return padding + input;
};
```

For this final `return` statement TypeScript is again able to perform some narrowing. It knows that if `padding` were a `number` then the above condition would be `true`, and the function would have returned in the body of the `if` block. Therefore if the code has reached this final `return` statement then `padding` is definitely _not_ a `number`, and therefore must be a `string`.

---

## Return Types

Adding return types to functions can better capture their intended behaviour and prevent bugs. In this case, without the `string` return type the compiler implicitly gives this function a return type of `string | undefined`. This doesn't match its intent, which is to always return a padded `string`.

```ts
const padLeft = (padding: number | string, input: string) => {
	if (typeof padding === 'number') {
		return ' '.repeat(padding) + input;
	}
};
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
};
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
};
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
};
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
};
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
};
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
};
```

Calling this function with `0` will result in `0` being returned.

---

## `instanceof`

In some situations it may be useful to check whether a value is an instance of a particular class, perhaps to access methods on that class. Another feature of JavaScript, the `instanceof` operator, can be used here.

```ts
const dateString = (date: string | Date): string => {
	if (date instanceof Date) {
		return date.toUTCString();
	}

	return date;
};
```

The `if` condition uses `instanceof` to check that `date` is an instance of the `Date` class. Then, inside the `if` statement, it's possible to access the `toUTCString` method that's available on instances of that class.

There will be more on classes in session 5.

---

## Union Types

There have been several examples so far of what TypeScript refers to as **union types**, which are formed from a combination (a union) of other types.

```ts
// A union of the `number` and `string` types
type Padding = number | string;
// A union of string literal types
type Pillar = 'News' | 'Opinion' | 'Sport' | 'Lifestyle' | 'Culture';
// A union of the `HTMLElement` and `null` types
type MaybeElement = HTMLElement | null;
// A union of the `string` and `Date` types
type StringOrDate = string | Date;
// Built into TypeScript: a union of `true` and `false`
type boolean = true | false;
```

Each of the sub-types of a union type is referred to as a "member" of the union. A value can be any one of these member types, and often it's necessary to figure out which one in order to interact with it. This is where narrowing comes in.

---

## Complex Unions: Element

Unions are useful for representing all kinds of application states. In many cases, unions of simple types, like primitives, are enough. Often, though, more complex structures are needed.

To take an example, it may be useful to write a type that represents different kinds of content that can appear in an article:

1. Text: a paragraph of text
2. Image: with a width, height, and a url

---

## An Element With Fields

A common way to represent data with multiple fields in JavaScript is with an object. There are multiple kinds of elements in this example, so a field with a union type could be included to specify this.

```ts
type Element = {
	kind: 'Text' | 'Image';
	copy: string;
	width: number;
	height: number;
	url: string;
};
```

There's a problem with this type, however, because when the element is an Image it won't have data to populate the `copy` field, and when it's Text it won't have data to populate `width`, `height` or `url`.

---

## An Element With Optional Fields

One way to deal with data that might not be present is to mark its field as optional. In this case all of these data fields could be missing for some kind of element, so they're all marked as optional.

```ts
type Element = {
	kind: 'Text' | 'Image';
	copy?: string;
	width?: number;
	height?: number;
	url?: string;
};
```

---

## Using An Element With Optional Fields

Having defined a type for `Element`, it should be possible to start using it in code.

```ts
const logElement = (element: Element): void =>
	console.log(`Image with aspect ratio: ${element.width / element.height}`);
```

However, this results in two errors.

```
'element.width' is possibly 'undefined'.
```

```
'element.height' is possibly 'undefined'.
```

---

## Narrowing Element?

Only images have a `width` and `height`, so it would be useful to be able to narrow the type of `Element` to an image before attempting to retrieve those fields. The `kind` field could be used for this:

```ts
const logElement = (element: Element): void => {
	if (element.kind === 'Image') {
		console.log(`Image with aspect ratio: ${element.width / element.height}`);
	}
};
```

Unfortunately this doesn't work and the errors still appear. The compiler has no way to know the `width` and `height` fields will always be there for image because the type doesn't say that: it says they may be missing at all times, even when `kind` is `'Image'`.

---

## Discriminated Unions

It is possible to check fields are present before using them. However, for objects representing multiple exclusive states with multiple fields, this sort of code can become both difficult to reason about and error-prone. A more robust solution is to change the way `Element` is represented to take advantage of a feature TypeScript calls **Discriminated Unions**:

```ts
type Text = {
	kind: 'Text';
	copy: string;
};

type Image = {
	kind: 'Image';
	width: number;
	height: number;
	url: string;
};

type Element = Text | Image;
```

`Element` is either a `Text` or an `Image`. When it's a `Text` the `copy` field is present and the other fields are not. When it's an `Image` the `width`, `height` and `url` fields are present and the `copy` field is not.

---

## Using Discriminated Unions

The key feature of discriminated unions is that they share a common field, called a _discriminant_, that can be checked to narrow the type. In this example this field is called `kind`.

```ts
const logElement = (element: Element): void => {
	if (element.kind === 'Image') {
		console.log(`Image with aspect ratio: ${element.width / element.height}`);
	} else {
		console.log(`Text with ${element.copy.split(' ').length} words`);
	}
};
```

When `kind` is `'Image'` TypeScript knows that it can narrow the type of `Element` to an `Image` and allow access to the `width` and `height` fields. When `kind` is `'Text'` TypeScript knows that it can narrow the type of `Element` to `Text` and allow access to the `copy` field.

---

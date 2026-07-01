## Functions

In JavaScript, functions are first-class objects which means they can be treated like any other value. We can:

- assign them to variables
- pass them to other functions
- return them from functions
- call them!

TypeScript builds on JavaScript by letting us describe a function's type:

- how many parameters it accepts
- the type of each parameter
- the type of value it returns (the return type)

This allows us to catch mistakes at compile time and work with functions in a type-safe way.

---

## Defining Functions in JavaScript

There are four common ways to define functions in JavaScript:

```js
function add(x, y) {
	return x + y;
}

const addExpression = function (x, y) {
	return x + y;
};

const addArrow = (x, y) => {
	return x + y;
};

const addShort = (x, y) => x + y;
```

---

## Understanding Functions in JavaScript

In the example below,

1. What type of value does this function return?
2. What kinds of values should we pass as arguments for it to work correctly?
3. How many arguments does this function expect?

```js
function a(b, c) {
	return b + c;
}
```

---

## What types are involved here?

### We don't really know! 😬

```js
function a(b, c) {
	return b + c;
}

a(1, 2);
a('hello', 'goodbye');
1 + a('2', 3);
```

Adding types to a function helps us verify that we are:

- passing the correct number and type of arguments
- using return value correctly, based on its type

---

## Adding Types

There are 3 ways to annotate a function with types:

- Short hand (Function type expression)
- Inline function annotations
- Call signatures (Object-style syntax for advanced use cases)

👉 You’ll most often see shorthand and inline types in real codebases.

---

## Adding Types

The **shorthand** approach uses a "function type expression" to define a type name.

```ts
//                        ┌──3─┐     ┌──4─┐
type StringLength = (str: string) => number;
//   ──────1─────   ───────────2───────────

const stringLength: StringLength = (str) => str.length;
//                  ──────5─────
```

1. type name
2. function type expression
3. parameter type
4. return type
5. annotating the function value with the type

---

## Adding Types

### Inline function annotations

We can add types directly when defining a function without using a separate function type.

```ts
//                     ───1──   ───2──
function greeter(name: string): string {
	return `Hi, ${name}!`;
}

const greeterArrow = (name: string): string => {
	return `Hi, ${name}!`;
};
```

1. the parameter's type
2. the return type

---

## Adding Types

### Call signatures

We can describe a function type using object syntax.
Call signatures are used when a function is also an object that holds properties

```ts
//   ────1───
type LengthFn = {
	(str: string): number; // 👈 1. The Call Signature
	//    ───2──   ───3──
	description: string; // 👈 2. A normal object property
};

const stringLength: LengthFn = (str) => str.length;
stringLength.description = 'Measures string length';
```

1. the type name
2. the parameter type
3. the return type

---

## Adding Types

```ts
// ----- Shorthand ----- //
type StringLength = (str: string) => number;

// ----- Inline ----- //
function greeter(name: string): string {
	return `Hi, ${name}!`;
}

// ----- Call signature ----- //
type LengthFn = {
	(str: string): number;
	description: string;
};
```

---

## Parameter Types

**Required parameters**

```ts
const add2 = (n1: number, n2: number): number => n1 + n2;
```

**Question:** what happens if we call `add2` like this?

```ts
add2('one', 'two');
```

---

## Parameter Types

TypeScript prevents us from doing this because it expects values of type `number`, but we passed `string`s.

```ts
const add2 = (n1: number, n2: number): number => n1 + n2;
add2('one', 'two');
// Argument of type 'string' is not assignable to parameter of type 'number'.
```

Similarly, we get an error if we don't pass enough arguments:

```ts
const add2 = (n1: number, n2: number): number => n1 + n2;
add2(1);
// Expected 2 arguments, but got 1.
```

---

## Parameter Types

**Optional parameters** can be `undefined`, and we can omit values for optional parameters.

```ts
// Declare an optional parameter by
// appending a "?" to the parameter name
const log = (message: string, prefix?: string): string =>
	// ─────────────────────────────^
	prefix ? `${prefix}: ${message}` : message;

// These calls are equivalent
log('Success!');
log('Success!', undefined);
```

---

## Parameter Types

In this example, is `prefix` an optional parameter?

```ts
const log = (message: string, prefix: string | undefined): string =>
	prefix ? `${prefix}: ${message}` : message;
```

---

## Parameter Types

Not quite! TypeScript will let us pass `undefined` as a value for `prefix`, but we can't omit a value:

```ts
const log = (message: string, prefix: string | undefined): string =>
	prefix ? `${prefix}: ${message}` : message;

// ❌ Expected 2 arguments, but got 1
log('Success!');

// ✅
log('Success!', undefined);
```

---

## Return Types

The return type tells us what values a function can return.

It's a contract for both the function body and where we call that function from (the call site).

```ts
// ----- Example 1 ----- //
// We get an error because the return value
// does not match the return type.
// Type 'string' is not assignable to type 'number'
const add = (a: number, b: number): number => 'hello';
//                      return type ------

// ----- Example 2 ----- //
// ✅
const add2 = (a: number, b: number): number => a + b;
```

---

## Return Types

```ts
const add2 = (a: number, b: number): number => a + b;

// We get an error here, because we're
// assigning the result of add2 (a number) to a string
const result: string = add2(1, 2);
```

---

## Return Types - `void`

In some cases, we don't want to return any value. We can tell TypeScript this explicitly using the `void` type:

```ts
// ----- Example 1 ----- //
function doNothing(): void {
	// Does nothing!
	return;
}

// ----- Example 2 ----- //
function doNothing2(): void {
	// Error: Type 'boolean' is not
	// assignable to type 'void'
	return true;
}
```

---

## Anonymous Functions and Callbacks

In some cases, TypeScript can infer a parameter's type from context. For example:

```ts
//              1
//             ----
[1, 2, 3].map((item, index) => item * index);
//                             ----
```

1. TypeScript infers that `item` is type `number` because of the starting array.
   This isn't magic! It uses Generics, which we will cover in session 6.

---

## Rest Parameters

Rest parameters enable us to accept **any number** of parameters to a function. The rest parameter **must come last** in the parameter list:

```ts
// ✅
//                      a rest parameter
//                      --------------
const sum = (n: number, ...m: number[]): number => // ...
```

Rest parameters are always array types, as they can have 0 or more elements.

If you do not provide a value for the rest parameter when calling the function,
its type will be an empty array, **not** `undefined`.

---

## Parameter Destructuring

Using parameter destructuring, we can extract properties from an object passed as an argument into local variables.

The type can define more properties than we choose to extract. We don't have to extract every property.

We see this pattern a lot in React components.

```tsx
type Props = {
	captionText: string;
	padCaption?: boolean;
	credit?: string;
	displayCredit?: boolean;
};

// A React component
function Caption({ captionText, credit, displayCredit }: Props) {
	return <></>;
}
```

---

### Parameter Destructuring

Similar to destructuring object parameters, we can also destructure array parameters.

This means we can extract just the values we want from the array:

```ts
function head([head]: number[]) {
	return head;
}

head([1, 2, 3]); // returns 1
```

---

## Functions as Values

In JavaScript, functions are first-class values, meaning they can be passed around just like strings or numbers.

We can use TypeScript to enforce a specific signature for these function values, which is useful for defining callbacks:

```ts
type NumberOp = (num1: number, num2: number) => number;
const add: NumberOp = (num1, num2) => num1 + num2;

function doOperation(operation: NumberOp, num1: number, num2: number): number {
	return operation(num1, num2);
}
doOperation(add, 3, 2);
```

---

## Function Overloading

Sometimes we want to call a single function in completely different ways:

```ts
makeDate(2023, 05, 20);
makeDate("2023-05-20");
```

To support this, we write multiple overload (call) signatures, followed by exactly one implementation signature.

👉 Crucial Rule: The implementation signature must be broad enough to handle all variants, but it is completely invisible to the outside world. Callers can only use the overload signatures.

---

## Function Overloading

```ts
// Overload Signature 1: Accepts a string
function makeDate(dateStr: string): Date;

// Overload Signature 2: Accepts three numbers (Year, Month, Day)
function makeDate(year: number, month: number, day: number): Date;

// Implementation Signature & Body
function makeDate(
	yearOrStr: number | string,
	month?: number,
	day?: number,
): Date {
	if (typeof yearOrStr === 'string') {
		// Call signature 1
	} else {
		// Call signature 2
	}
}
```

---

## Function Overloading

JavaScript doesn't actually support function overloading.
If you define a function multiple times (`function name() {}`), the last definition "wins".

TypeScript's function overloading is just a compile-time feature; the extra signatures are completely erased when compiled to JavaScript.

The result is behaviour that _looks_ like overloading.

👉 The Reality: The compiled JavaScript is just one single function. Because of this, your TypeScript implementation signature and function body must be flexible enough to handle all the different variations at runtime.

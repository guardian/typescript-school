## Functions

In JavaScript, functions are first-class objects. We can:

- assign them to variables
- pass them to other functions
- return them from functions
- call them!

With TypeScript, we can define:

- how many parameters a function takes, and what types they have
- what values the function can return (the "return type")

This enables us to work with functions in a type-safe way.

---

## Declaring Functions in JavaScript

There are four common ways of declaring functions in JavaScript:

```js
function a(b, c) {
	return b + c;
}

const d = (e, f) => {
	return e + f;
};

const g = (h, i) => h + i;

const j = function (k, l) {
	return k + l;
};
```

---

## Declaring Functions in JavaScript

In the example below,

1. what type of value does this function return?
2. what values can we pass as arguments for this function to work correctly?
3. how many arguments can we call this function with?

```js
function a(b, c) {
	return b + c;
}
```

---

## Declaring Functions in JavaScript

### We don't know! 😬

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
- using return value correctly, given its type

---

## Adding Types

There are 3 ways to annotate a function with types:

- Short hand
- Inline
- Call signatures (or long hand). We'll cover these towards the end of this session.

You're most likely to encounter short hand and inline type annotations.

---

## Adding Types

The **shorthand** annotation assigns a "function type expression" to a type name.

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

### Inline

```ts
//                     ───1──   ───2──
function greeter(name: string): string {
	return `Hi, ${name}!`;
}
```

1. the parameter's type
2. the return type

---

## Adding Types

### Call signatures

```ts
//   ────1───
type LengthFn = {
	(str: string): number;
	//    ───2──   ───3──
};
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

In some cases, TypeScript can infer a parameter's type. For example:

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
function Caption({ captionText, credit, displayCredit }: Props) => (<></>)
```

---

## Functions as Values

We can use TypeScript to specify that a value should be a function with a specified signature. This is useful for callbacks:

```ts
type NumberOp = (num1: number, num2: number) => number;
const add: NumberOp = (num1: number, num2: number): number => {
	return num1 + num2;
};

function doOperation(operation: NumberOp, num1: number, num2: number): number {
	return operation(num1, num2);
}
doOperation(add, 3, 2);
```

---

## Function Overloading

Sometimes we want to call a function in different ways:

```ts
makeDate(2023, 05, 20);
makeDate("2023-05-20");
```

We write multiple call signatures for a function using function overloading.
We can write multiple function signatures and _one_ implementation signature.

The implementation signature must handle all variants of the call signatures.

---

## Function Overloading

```ts
// Call signature 1
function makeDate(dateStr: string): Date;
// Call signature 2
function makeDate(day: number, month: number, year: number): Date;
// Implementation signature & implementation
function makeDate(
	strOrDay: string | number,
	month?: number,
	year?: number,
): Date {
	if (typeof strOrDay === 'string') {
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

TypeScript's function overloading is just syntactic sugar over the JavaScript constructs.
The result is behaviour that _looks_ like overloading.
The reality is it can require a complex function signature and body to handle the different inputs.
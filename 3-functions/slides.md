## Functions

In JavaScript, functions are first-class objects. We can:

- assign them to variables
- pass them to other functions
- return them from functions
- & some other things

TypeScript enables us to work with functions in a type-safe way.

---

## Declaring Functions in JavaScript

There are four common ways of declaring functions in JavaScript:

```js
function a(b, c) {
	return b + c;
}

const e = (f, g) => {
	return f + g;
};

const h = (i, j) => i + j;

const l = function (m, n) {
	return m + n;
};
```

---

## Declaring Functions in JavaScript

In the example below,

1. what type of value does this function return?
2. what type of values can we pass as arguments?
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
```

Adding types to a function helps us verify that we are:

- passing the correct number and type of arguments
- using return value correctly

---

## Adding Types

### Short hand

```ts
type StringLength = (str: string) => number;
//                           1          2
```

1. the parameter's type
2. the return type

### Usage

```ts
const stringLength: StringLength = (str) => 0;
```

---

## Adding Types

### Inline

```ts
//                        1        2
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
//       1
type LengthFn = {
	(str: string): number;
	//       2        3
};
```

1. the type name
2. the parameter type
3. the return type

---

## Adding Types

```ts
// ----- Shorthand ----- //
//                           1          2
type StringLength = (str: string) => number;

// ----- Inline ----- //
//                        1        2
function greeter(name: string): string {
  return `Hi, ${name}!`;
}

// ----- Call signature ----- //
type LengthFn = {
  (str: string): number;
//         1        2
};
```

---


## Parameter Types

- Optional
- Default

---

## Return Types

---

## Anonymous Functions

---

## Functions as TypeScript Helpers

- Type Guards

---

## Function Overloading

---

## Rest Parameters

---

## Functions as Values

---

## Further Topics to Explore

- `this`
- `call`, `apply` and `bind`

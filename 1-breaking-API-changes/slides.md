# Breaking API Changes

TypeScript helps us manage breaking API changes.

_“JavaScript which scales”_ – read more at
[“Why Create TypeScript”](https://www.typescriptlang.org/why-create-typescript).

---

## You’ve seen it before

If you write JavaScript, you (most likely) already use it.

- Powers IDE autocompletion
- Compatible with JSDoc
- Used by some NPM packages

---

## A compiler for JavaScript

Valid JavaScript can be interpreted by TypeScript.

```js
let variable;
variable = true;
variable = { id: 'guardian' };
variable = 'invalid';

console.log(variable.id);
//                   ^^
// Property 'id' does not exist on type 'string'. (TS 2339)
```

See
[playground](https://www.typescriptlang.org/play?ts=5.2.2#code/DYUwLgBAbghgTgSxgI1AbgFC0S0EC8EYcAriJtkqiARAN4QIAmAXBAEQDmJ8TSAduwgBfCvCp5C7BP1jBm7TBgDGAe34BnVaAB0wVZwAUlXCB3MAlGiA).

---

## Common examples

TypeScript analyses your code, and can catch errors related to JavaScript
dynamic types.

- incorrect object key
- invalid function parameters
- out of bounds array index
- missed switch case

---

## Manipulating the DOM

Let’s take the following code, which would runs directly in your browser:

```js
const li = document.createElement('li');
document.querySelector('ul').appendChild(li);
```

But what happens when there’s no `<ul>` on the page?\
The TypeScript compiler encourages handling this case.

```ts
const li = document.createElement('li');
document.querySelector('ul')?.appendChild(li);
//                          ^ conditional chaining
```

---

## Strict Settings

To get the most from the compiler, we’ll be using the strictest settings.
Because TypeScript does not enforce any runtime checks, you as a developer
always get the final say, but hope that by the end of these sessions you’ll be
empowered to create and maintain fully type-safe code.

---

## Searching the Guardian

Let’s start with a working TypeScript example to get a feel for the benefits of
having a type system.

We will display a CAPI query as cards with minimal styling.

There’s an unhandled error that’s currently invisible. Let’s dive in!

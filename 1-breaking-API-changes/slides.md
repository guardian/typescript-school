# Breaking API Changes

Let’s start with a working TypeScript example to get a feel for the benefits of having a type system.

_“JavaScript which scales”_ is a tag line, read more at [“Why Create TypeScript”](https://www.typescriptlang.org/why-create-typescript).

---

## A compiler for JavaScript

The following code works directly in your browser:

```ts
const li = document.createElement('li');
document.querySelector('ul').appendChild(li);
//                          ~
```

But what happens when there’s no `<ul>` on the page?
The TypeScript compiler will request that you handle this case.

```ts
const li = document.createElement('li');
document.querySelector('ul')?.appendChild(li);
//                          ^ conditional chaining
```

---

## Strict Settings

To get the most from the compiler, we’ll be using the strictest settings.
Because TypeScript does not enforce any runtime checks, you as a developer
always get the final say, but hope that by the end of these sessions you’ll
be empowered to create and maintain fully type-safe code.

---

## @guardian/tsconfig

- `noUncheckedIndexedAccess`ﬂ

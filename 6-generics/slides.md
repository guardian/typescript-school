# Generics

Generics provide a way to make code more reusable.

There's a chapter on them in the TypeScript handbook: https://www.typescriptlang.org/docs/handbook/2/generics.html

## An Identity Function For Numbers

This is an "identity" function for `number`s. It takes a `number` and returns it unchanged. It's probably one of the simplest functions you could write.

```ts
const identity = (a: number): number => a;
```

## More Identity Functions

The previous example only provided an identity function for `number`s. If you want to do the same for `string`s you can write something very similar.

```ts
const identityNumber = (a: number): number => a;
const identityString = (a: string): string => a;
```

## Even More Identity Functions

There are a large number of types you may want to write identity functions for. Writing a new function for each of these could get repetitive quickly.

```ts
const identityNumber = (a: number): number => a;
const identityString = (a: string): string => a;
const identityArrayNumber = (a: Array<number>): Array<number> => a;
const identityArrayString = (a: Array<string>): Array<string> => a;
```

## A Better Way?

This is where generics are useful. This example actually already demonstrates a use of generics, the `Array` type, which will be covered in more detail later.

```ts
const identityNumber = (a: number): number => a;
const identityString = (a: string): string => a;
const identityArrayNumber = (a: Array<number>): Array<number> => a;
                                -------------   -------------
const identityArrayString = (a: Array<string>): Array<string> => a;
                                -------------   -------------
```

## The (Generic) Identity Function

Using generics, a general-purpose identity function can be defined that works on any type.

```ts
const identity = <A>(a: A): A => a;
```

This takes a value of type `A` and returns that same value of type `A`.

## Type Parameters

The angle brackets (`<>`) define **type parameters**, to go along with the **value parameters** between standard brackets (`()`).

```ts
const identity = <A>(a: A): A => a;
```

Value parameters, like `a`, are given a name and can be referred to by that name throughout the rest of the function definition. The same is true of type parameters; the name of the type given between the angle brackets can then be used to refer to that type elsewhere in the function. In this case `A` is used both to annotate the value parameter, `a`, and as the function's return type.

## Using The Generic Identity Function

When calling generic functions, you pass the value parameters between standard brackets (`()`) and type parameters between angle brackets (`<>`).

```ts
const num: number = identity<number>(42);
const string: string = identity<string>('news');
const pillar: Pillar = identity<Pillar>(Culture);
```

## Type Inference

In most cases TypeScript is able to infer the type parameters, so you can omit them.

```ts
const num: number = identity(42);
const string: string = identity('news');
const pillar: Pillar = identity(Culture);
```

Sometimes you get type errors because TypeScript can't correctly figure out what the type of a type parameter should be. These can be fixed by adding it back in again.

## Comparison With The `any` Type

It's important to note that a generic type is *not* the same as the `any` type. It refers to a specific type passed in via a type parameter. Doing something like this will result in a type error:

```ts
const identity = <A>(a: A): A => "opinion";
```

```
Type 'string' is not assignable to type 'A'.
  'A' could be instantiated with an arbitrary type which could be unrelated to 'string'
```

When `identity` is called with a type like `number` passed in as the type parameter, then `A` is the ("concrete") type `number` throughout the rest of the function definition. This is the "arbitrary type" referred to in the error message above. Because the function has to return `A` (a `number`) it cannot return `"opinion"` because that's a `string`.

If the return type were `any` instead then this would be allowed and no type error would occur.

## Generic Types

It's not just functions that can suffer from repetition; types can too. Arrays, for example, can have elements that could be lots of different types. It would be repetitive to have to define a different array type, including all the methods like `.map`, for each type an array could contain.

```ts
const numbers: NumberArray = [1, 2, 3];
const strings: StringArray = ['news', 'opinion', 'culture'];
const pillars: PillarArray = [News, Opinion, Culture];
```

Also, given that the array type is built into TypeScript itself, it might be difficult to create a version of the array type for custom types like `Pillar` above.

## The (Generic) Array Type

TypeScript's solution is to use a *generic* Array type. It's defined once and has a generic type parameter.

```ts
const numbers: Array<number> = [1, 2, 3];
const strings: Array<string> = ['news', 'opinion', 'culture'];
const pillars: Array<Pillar> = [News, Opinion, Culture];
```

## Writing Generic Types

If you were writing the `Array` type yourself, it might look something like this:

```ts
type Array<Element> = {
    length: number;
}
```

Generic types are similar to generic functions in that they take a set of type parameters inside a pair of angle brackets (`<>`).

## Using Generic Type Parameters

As with functions, the type parameter can be used elsewhere in the type definition.

```ts
type Array<Element> = {
    length: number;
    includes(element: Element): boolean;
}
```

The `includes` methods checks whether an array contains a given element. The type definition ensures that you can't call this method with a value that isn't of the same type as the elements in the array.

## Generic Classes

Classes can also be generic. An alternative implementation of `Array` using a class might look like this:

```ts
class Array<Element> {
    length: number = 0;
    includes(element: Element): boolean {
        // Implementation for `includes`.
    }
    constructor(/* Constructor arguments */) {
        // Constructor implementation
    }
}
```

## Implementations Of Generic Functions

Let's assume you don't know what the implementation of this function is, you only have the type. What possible implementations could it have?

```ts
const identity = <A>(a: A): A => ???;
```

There is *only one* possible implementation of this function (excluding side effects), and that is to return `a`. It's not possible to call `.length` because `A` might not be an array type. It's not possible to add anything with `+` because `A` might not be a `number` or a `string` type.

## Limiting What A Function Is Allowed To Do

It could be argued that generic types, because they can be anything, tell you very little about what a function can do. But often the opposite is true: they limit what a function can do. It's easier to tell what a generic `identity` function does than one that isn't generic:

```ts
const identity = (a: string): string => ???;
```

This function could return the same `string`; or a completely different `string`; or the same `string` reversed; or a substring; or the given `string` concatenated with another `string`; and so on.

## Limitations Of Generic Types?

The ability to limit what a function can do by making it generic is useful. However, sometimes it's also useful to know a little bit more about what features a generic type might have.

```ts
const getLength = <A>(a: A): number => a.length;
```

The `getLength` function here gives a type error, because `a` might not have a property `length`.

## Dropping Generic Types?

One way to solve this might be to drop generics and use a specific type instead.

```ts
const getLength = (a: string): number => a.length;
```

This works for `string`s, but it doesn't work for other types with length, like `Array`s. One option would be to extend the definition to include `Array`, but it might not be possible to predict all the types you might want to use this function with in future, and include them in the definition.

## Generic Constraints

To solve this problem, TypeScript allows types to be **constrained** to have certain features whilst still remaining generic.

```ts
type HasLength = {
    length: number;
}

const getLength = <A extends HasLength>(a: A): number => a.length;
```

Here the `extends` keyword says that `A` has to be a type that includes the `length` property. It can be any type that has this property, like `string` or `Array`, but it can't be a type that doesn't, like `number`.

## Multiple Type Parameters

Multiple type parameters work in much the same way as multiple value parameters.

```ts
const f = <A, B, C>(a: A, b: B): C => ???;
```

## Type Parameter Defaults

It's also possible to set defaults for type parameters, as is the case for value parameters.

```ts
const f = <A, B = string, C = number>(a: A, b: B): C => ???;
```

# Types

A more detailed look at types, and how TypeScript's approach to types compares to other languages. Topics include:

- Types vs values
- Structural typing vs nominal typing

There's more information on how TypeScript handles structural typing in the TypeScript handbook: https://www.typescriptlang.org/docs/handbook/type-compatibility.html

---

## Types vs Values

Types and values live in different worlds.

<!--omit-from-slides start-->
Types can only be used where types are expected, and values can only be used where values are expected. Or, to put it another way, you cannot use a value as a type, and you cannot use a type as a value.
<!--omit-from-slides end-->

```ts
type Foo = number;
const foo: Foo = 5;

// Error: 'foo' refers to a value,
// but is being used as a type here.
const bar: foo = 5;

// Error: 'Foo' only refers to a type,
// but is being used as a value here.
const baz = Foo;
```

---

## Types And Values In Other Languages

The separation of types and values is not unique to TypeScript, it's the case across many languages. For example, in Scala:

```scala
object Example {
  type Foo = Int
  val foo: Foo = 5

  // Error: not found: type foo
  val bar: foo = 5

  // Error: not found: value Foo
  val baz = Foo
}
```

---

## Classes In Scala

In Scala it's common to work with classes, which automatically create both types and values when they're defined:

```scala
class Foo() {}

case class Bar()

object Example {
  val foo: Foo = new Foo()

  val bar: Bar = Bar()
}
```

---

## Classes In TypeScript

As mentioned in [session 5](../5-classes), TypeScript classes also create both types and values when they're defined:

```ts
class Foo {}

const foo: Foo = new Foo()
```

---

## Structural Typing vs Nominal Typing

**Nominal type systems** compare types by name, and typically require explicitly defined relationships between types for those types to be considered compatible.

For example, a `Bicycle` might have to explicitly extend or implement a `Vehicle` in order for a `Bicycle` to be considered a `Vehicle`.

**Structural type systems** compare types by structure, and therefore do not necessarily require an explicit relationship between types to be defined for those types to be considered compatible.

For example, a `Bicycle` might just need to have the same structure, e.g. members, as a `Vehicle` in order for a `Bicycle` to be considered a `Vehicle`.

---

## Nominal Typing Example: Scala

<!--omit-from-slides start-->
In this example we define a trait called `Named`, which specifies an interface containing a single value, `name`, of type `String`. We also define a method called `hello`, which takes a value of type `Named` and returns a `String` with a greeting.

In addition, we define a case class `Person`, with two fields: `name` and `job`, both of which are `String`s. We then create an instance of `Person` for "CP Scott". Finally, we attempt to pass this `Person` to the `hello` method.
<!--omit-from-slides end-->

```scala
trait Named {
  val name: String
}

def hello(named: Named): String =
  s"Hello ${named.name}"

case class Person(name: String, job: String)

val cpScott = Person("CP Scott", "Journalist")
val helloCPScott = hello(cpScott)
```

```
Type mismatch: found Person, required Named
```

<!--omit-from-slides start-->
Unfortunately, this results in an error. `Person` is not compatible with the type `Named` that `hello` requires, as `Person` has no defined relationship with `Named`.
<!--omit-from-slides end-->

---

## Nominal Typing Example: Scala Corrected

<!--omit-from-slides start-->
The error in the previous example can be fixed by explicitly defining a relationship between `Person` and `Named`. In this case that means having the `Person` case class extend the `Named` trait, which means `Person` is now considered compatible with `Named`.
<!--omit-from-slides end-->

```scala
trait Named {
  val name: String
}

def hello(named: Named): String =
  s"Hello ${named.name}"

case class Person(name: String, job: String) extends Named

val cpScott = Person("CP Scott", "Journalist")
val helloCPScott = hello(cpScott)
```

---

## Structural Typing Example: TypeScript

<!--omit-from-slides start-->
In this example we define a type called `Named`, which specifies an interface containing a single value, `name`, of type `string`. We also define a function called `hello`, which takes a value of type `Named` and returns a `string` with a greeting.

In addition, we define a type `Person`, with two fields: `name` and `job`, both of which are `string`s. We then create an object for "CP Scott", and specify that it's of type `Person`. Finally, we attempt to pass this object to the `hello` function.
<!--omit-from-slides end-->

```ts
type Named = { name: string };

const hello = (named: Named): string =>
  `Hello ${named.name}`;

type Person = { name: string, job: string };

const cpScott: Person = {
  name: 'CP Scott',
  job: 'Journalist',
};
const helloCPScott = hello(cpScott);
```

<!-- This comment exists to fix a parsing bug! If it's removed, the following doesn't get omitted! -->
<!--omit-from-slides start-->
This works despite the fact that neither the object nor its type `Person` has any explicitly defined relationship with the `Named` type. TypeScript just wants to know whether the type of whatever is passed to the `hello` function has the same **structure** as the type `Named`. In this case that structure is a field called `name` of type `string`, and because `Person` has such a field the types are considered compatible.
<!--omit-from-slides end-->

---

## Structural Typing Example: TypeScript Updated

<!--omit-from-slides start-->
TypeScript doesn't actually require an explicitly defined type to compare with `Named` at all. The example above could be updated to remove the `Person` type, allowing the compiler to infer a type for `cpScott` instead. In this case that inferred type still includes a field `name` of type `string`, so the types are still considered compatible.
<!--omit-from-slides end-->

```ts
type Named = { name: string };

const hello = (named: Named): string =>
  `Hello ${named.name}`;

const cpScott = { name: 'CP Scott', job: 'Journalist' };
const helloCPScott = hello(cpScott);
```

<!--omit-from-slides start-->
**Note:** The removal of `Person` here is for demonstration purposes. In practice it's often useful to include explicitly defined types, both to provide more information to the compiler and to help anyone reading the code.
<!--omit-from-slides end-->

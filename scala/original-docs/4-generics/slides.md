# Generics

Generics provide a way to make code more reusable.

---

## An Identity Method For Numbers

<!--omit-from-slides start-->
This is an "identity" method for `Int`s. It takes an `Int` and returns it unchanged. It's probably one of the simplest methods you could write.
<!--omit-from-slides end-->

```scala
def identity(a: Int): Int = a
```

---

## More Identity Methods

<!--omit-from-slides start-->
The previous example only provided an identity method for `Int`s. If you want to do the same for `String`s you can write something very similar.
<!--omit-from-slides end-->

```scala
def identityNumber(a: Int): Int = a

def identityString(a: String): String = a
```

---

## Even More Identity Methods

<!--omit-from-slides start-->
There are a large number of types you may want to write identity methods for. Writing a new method for each of these could get repetitive quickly.
<!--omit-from-slides end-->

```scala
def identityNumber(a: Int): Int = a

def identityString(a: String): String = a

def identityListNumber(a: List[Int]): List[Int] = a

def identityListString(a: List[String]): List[String] = a
```

---

## A Better Way?

<!--omit-from-slides start-->
This is where generics are useful. This example actually already demonstrates a use of generics, the `List` type, which will be covered in more detail later.
<!--omit-from-slides end-->

```scala
def identityNumber(a: Int): Int = a

def identityString(a: String): String = a

def identityListNumber(a: List[Int]): List[Int] = a
//                        ---------   ---------
def identityListString(a: List[String]): List[String] = a
//                        ------------   ------------
```

---

## The (Generic) Identity Method

<!--omit-from-slides start-->
Using generics, a general-purpose identity method can be defined that works on any type.
<!--omit-from-slides end-->

```scala
def identity[A](a: A): A = a
```

<!--omit-from-slides start-->
This takes a value of type `A` and returns that same value of type `A`.
<!--omit-from-slides end-->

---

## Type Parameters

The square brackets (`[]`) define **type parameters**, to go along with the **value parameters** between standard brackets (`()`).

```scala
def identity[A](a: A): A = a
```

<!--omit-from-slides start-->
Value parameters, like `a`, are given a name and can be referred to by that name throughout the rest of the method definition. The same is true of type parameters; the name of the type given between the square brackets can then be used to refer to that type elsewhere in the method. In this case `A` is used both to annotate the value parameter, `a`, and as the method's return type.
<!--omit-from-slides end-->

---

## Using The Generic Identity Method

When calling generic method, you pass the value parameters between standard brackets (`()`) and type parameters between square brackets (`[]`).

```scala
val num: Int = identity[Int](42)

val string: String = identity[String]("news")

val pillar: Pillar = identity[Pillar](Culture)
```

---

## Type Inference

<!--omit-from-slides start-->
In most cases Scala is able to infer the type parameters, so you can omit them.
<!--omit-from-slides end-->

```scala
val num: Int = identity(42)

val string: String = identity("news")

val pillar: Pillar = identity(Culture)
```

<!--omit-from-slides start-->
Sometimes you get type errors because Scala can't correctly figure out what the type of a type parameter should be. These can be fixed by adding it back in again.
<!--omit-from-slides end-->

---

## Comparison With The `Any` Type

<!--omit-from-slides start-->
It's important to note that a generic type is _not_ the same as the `Any` type. It refers to a specific type passed in via a type parameter. Doing something like this will result in a type error:
<!--omit-from-slides end-->

```scala
def identity[A](a: A): A = "opinion"
```

```
[E007] Type Mismatch Error:
  Found:    ("opinion" : String)
  Required: A
```

<!--omit-from-slides start-->
When `identity` is called with a type like `Int` passed in as the type parameter, then `A` is the ("concrete") type `Int` throughout the rest of the method definition. Because the method has to return `A` (an `Int`) it cannot return `"opinion"` because that's a `String`.

If the return type were `Any` instead then this would be allowed and no type error would occur.
<!--omit-from-slides end-->

---

## Generic Types

<!--omit-from-slides start-->
It's not just methods that can suffer from repetition; types can too.

Lists, for example, can have elements that could be lots of different types. It would be repetitive to have to define a different List type, including all the methods like `.map`, for each type an List could contain.
<!--omit-from-slides end-->

```scala
val numbers: IntList = IntList(1, 2, 3)

val strings: StringList = StringList("news", "opinion", "culture")

val pillars: PillarList = PillarList(News, Opinion, Culture)
```

<!-- This comment exists to fix a parsing bug! If it's removed, the following doesn't get omitted! -->
<!--omit-from-slides start-->
Also, given that the List type is built into Scala itself, it might be difficult to create a version of the List type for custom types like `Pillar` above.
<!--omit-from-slides end-->

---

## The (Generic) List Type

<!--omit-from-slides start-->
Scala's solution is to use a _generic_ List type. It's defined once and has a generic type parameter.
<!--omit-from-slides end-->

```scala
val numbers: List[Int] = List(1, 2, 3)

val strings: List[String] = List("news", "opinion", "culture")

val pillars: List[Pillar] = List(News, Opinion, Culture)
```

---

## Writing Generic Types

<!--omit-from-slides start-->
If you were writing the `List` type yourself, it might look something like this:
<!--omit-from-slides end-->

```scala
class List[Element] {
	def length: Int = ???
}
```

Generic classes are similar to generic methods in that they take a set of type parameters inside a pair of square brackets (`[]`).

---

## Using Generic Type Parameters

<!--omit-from-slides start-->
As with methods, the type parameter can be used elsewhere in the type definition.
<!--omit-from-slides end-->

```scala
class List[Element] {
	def length: Int = ???

	def contains(element: Element): Boolean = ???
}
```

<!--omit-from-slides start-->
The `contains` method checks whether a List contains a given element. The type definition ensures that you can't call this method with a value that isn't of the same type as the elements in the List.
<!--omit-from-slides end-->

---

## Generic Traits

<!--omit-from-slides start-->
Traits can also be generic. You could define common behaviour for a number of different collection types like this:
<!--omit-from-slides end-->

```scala
trait Seq[Element] {
	def length: Int

	def contains(element: Element): Boolean
}
```

---

## Multiple Type Parameters

<!--omit-from-slides start-->
Multiple type parameters work in much the same way as multiple value parameters.
<!--omit-from-slides end-->

```scala
def f[A, B, C](a: A, b: B): C = ???

class F[A, B, C] {}

trait F[A, B, C] {}
```

---

## Implementations Of Generic Methods

Let's assume you don't know what the implementation of this method is, you only have the type. What possible implementations could it have (excluding side effects)?

```scala
def identity[A](a: A): A = ???
```

---

## Only One Implementation

<!--omit-from-slides start-->
There is _only one_ possible implementation of this method (excluding side effects), and that is to return `a`. It's not possible to call `.length` because `A` might not be a List type. It's not possible to add anything with `+` because `A` might not be an `Int` or a `String` type.
<!--omit-from-slides end-->

```scala
def identity[A](a: A): A = a
```

---

## Limiting What A Method Is Allowed To Do

<!--omit-from-slides start-->
It could be argued that generic types, because they can be anything, tell you very little about what a method can do. But often the opposite is true: they limit what a method can do. It's easier to tell what a generic `identity` method does than one that isn't generic:
<!--omit-from-slides end-->

```scala
def identity(a: String): String = ???
```

This method could return the same `String`; or a completely different `String`; or the same `String` reversed; or a substring; or the given `String` concatenated with another `String`; and so on.

---

## Limitations Of Generic Types?

<!--omit-from-slides start-->
The ability to limit what a method can do by making it generic is useful. However, sometimes it's also useful to know a little bit more about what features a generic type might have.
<!--omit-from-slides end-->

```scala
def getLength[A](a: A): Int => a.length
```

<!--omit-from-slides start-->
The `getLength` method here gives a type error, because `a` might not have a property `length`.
<!--omit-from-slides end-->

---

## Dropping Generic Types?

<!--omit-from-slides start-->
One way to solve this might be to drop generics and use a specific type instead.
<!--omit-from-slides end-->

```scala
def getLength(a: String): Int = a.length
```

<!--omit-from-slides start-->
This works for `String`s, but it doesn't work for other types with length, like `List`s. One option would be to extend the definition to include `List`, but it might not be possible to predict all the types you might want to use this method with in future, and include them in the definition.
<!--omit-from-slides end-->

---

## Generic Constraints

To solve this problem, Scala allows types to be **constrained** to have certain features whilst still remaining generic.

```scala
def getLength[A <: Seq[?]](a: A): Int = a.length
```

<!--omit-from-slides start-->
Here the `<:` operator says that `A` has to be a sub-type of `Seq`, which is a trait that includes the `length` method. It can be any sub-type that has this property, like `List` or `String`, but it can't be a type that doesn't, like `Int`. This is known as an "Upper Type Bound".
<!--omit-from-slides end-->

---

## Other Generic Constraints

<!--omit-from-slides start-->
There are other kinds of generic constraints detailed in the Scala docs:
<!--omit-from-slides end-->

- Lower Type Bounds: https://docs.scala-lang.org/tour/lower-type-bounds.html
- Variances: https://docs.scala-lang.org/tour/variances.html

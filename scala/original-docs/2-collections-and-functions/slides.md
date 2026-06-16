# Collections and Functions

---
## Useful collection types...

* `Seq` - sequential items (`List`)
```scala mdoc
Seq("Time", "After", "Time")
Seq(1, 1, 2, 3, 5, 7)
```
* `Set` - unique items, unordered
```scala mdoc
Set("Time", "After", "Time")
Set(1, 1, 2, 3, 5, 7)
```
* `Map` - key-values, with unique keys, unordered
```scala mdoc
Map("England" -> 20, "Latvia" -> 0)
```

---
## `Seq` - sequences

```scala mdoc
Seq("Alpha", "Beta", "Gamma")

Seq(42, 7, 3, 1, 7 ,7 ,7)
```

---
## `Set` - unique items, unordered

* Enforced de-duplication
* Great for bulk API calls!

```scala
// No-one can ever wastefully pass this method duplicate ids...
def bulkRequestToApi(ids: Set[Int]) = ...
```
<!--omit-from-slides start-->
The parameter type of `ids` - `Set[Int]` - forbids it!
<!--omit-from-slides end-->

---
## `Map` - key-values, with unique keys, unordered

```scala mdoc:silent
val expensesByMP = Map("Phil" -> 42674, "Barbara" -> 42458, "Bernard" -> 36909)
```

* Fast lookup of values by key

```scala mdoc
expensesByMP("Phil")
expensesByMP.get("Barbara")
expensesByMP.get("Andrew") // Doesn't crash!
```

---
## ...many more collection types!

![Scala's immutable collections](https://docs.scala-lang.org/resources/images/tour/collections-immutable-diagram-213.svg)

<!--omit-from-slides start-->
https://docs.scala-lang.org/overviews/collections-2.13/overview.html

The different collection types have different uses and
[performance characteristics](https://docs.scala-lang.org/overviews/collections-2.13/performance-characteristics.html) -
you can sometimes make slow code go faster by choosing the right type!
<!--omit-from-slides end-->

---
## Immutability

In Scala, we prefer immutability everywhere:

* **Eliminate side-effects**
  * prevents race conditions
  * avoids need for locking
* **Predictable State** - easier to debug
* **Safely Share**

---
## Immutability - use `val`, not `var`

* `val` can not be assigned a new value ✅
* `var` can be mutated 😟

```scala mdoc
val hasErrors = true // can not be changed

var valid = true
valid = false

println(valid)
```

---
## Immutable collections

* Immutable collections can't be _changed_
* Any action to 'modify' a collection:
  * creates a new one
  * leaves original unchanged

---
## Joining sequences & elements

```scala mdoc:reset:silent
val fruit = Seq("Banana", "Cherry")
val veg = Seq("Edamame", "Fennel")
```

### Adding a single element

```scala mdoc
"APPLE" +: fruit

           fruit :+ "DURIAN"
```

### Joining two sequences

```scala mdoc
fruit ++ veg
```

---
## Doing more interesting stuff

How?

---
## Doing more interesting stuff

Scala collections have a plethora of useful methods:

* `.filter()`
* `.exists()`
* `.find()`
* `.maxBy()` / `.minBy()`
* `.count()`
* `.map()` & `.flatMap()`
* ...

---
```scala mdoc:reset:silent
val names = Seq("Ace", "Bob", "Alice", "Dave")
```

## `.filter()`
```scala mdoc
names.filter(_.length > 3)
```

## `.exists()`
```scala mdoc
names.exists(_.contains('e'))
names.exists(_.contains('f'))
```

## `.maxBy()`/`.minBy()`
```scala mdoc
names.maxBy(_.length)
```

## `.count()`
```scala mdoc
names.count(_.length > 4)
```

---
## How do we use these helpful methods?

(simplified) definition of those methods:

```scala
trait Seq[A] {
  def filter(pred: A => Boolean): Seq[A] = ...

  def exists(pred: A => Boolean): Boolean = ...

  def map[B](f: A => B): Seq[B] = ...
}
```

...they all accept a _function_ as a parameter

* A => Boolean

---
## Functions!

Functions:

* take input of a specified type
* give output of a specified type

```scala
def filter(pred: String => Boolean): Seq[String]
```

`String => Boolean` is the _type_ this method accepts

<!--omit-from-slides start-->
To provide a _value_ of that type, you need to implement
a function that accepts a `String`, and gives a `Boolean`.
<!--omit-from-slides end-->

---
## Functions syntax

These are all equivalent:

```scala mdoc:reset:silent
val names = Seq("Ace", "Bob", "Alice", "Dave")
```

```scala mdoc
names.filter((s: String) => s.length > 3)
names.filter(s => s.length > 3)
names.filter(_.length > 3)

def myCriteria(s: String): Boolean = s.length > 3

names.filter(myCriteria(_))
names.filter(myCriteria)
```

---
## Using a method as a function

These are all equivalent:

```scala mdoc:reset:silent
val names = Seq("Ace", "Bob", "Alice", "Dave")
```

```scala mdoc
names.filter(_.length > 3)

def myCriteria(s: String): Boolean = s.length > 3

names.filter(myCriteria(_))
names.filter(myCriteria)
```
---

## `.map()` is not `Map`!

* `.map()` - a method: transforming the items of a collection
* `Map[K, V]` - a type: a collection of key-value pairs

---

## `.groupBy()`

```scala mdoc:reset
val names = Seq("Ace", "Bob", "Alice", "Dave")

names.groupBy(_.head)

names.groupBy(_.length)
```

---
## Often when using `List`...

...we just mean `Seq`, and should use that!

In Scala, `List` is a very _specific_ implementation of the `Seq` trait.

`List` uses a linked-list structure, a bit like a series of nesting dolls:

![Diagram of nested linked list](https://github.com/user-attachments/assets/f37123ab-e844-43b4-a2c5-647a88c4bf1c)

<!--omit-from-slides start-->
Using a structure like this makes it slower to do things like:

* Getting the _nth_ item in the `List`
* Getting the **number of items** in the `List`
* Inserting an item somewhere deep in the `List`

More details at: https://github.com/guardian/maintaining-scala-projects/issues/25
<!--omit-from-slides end-->

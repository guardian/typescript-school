# Implicits

---
## "Explicit"

_adjective_: openly stated or shown

---
## "Implicit"

_adjective_: unsaid, but understood from context

---
## What does explicit code look like?

_pretty much all code we write is 'explicit'_

```scala mdoc:silent
trait Encoder[T] {
  def encode(value: T): String
}

object ApiClient1 {
  def send[T](value: T, encoder: Encoder[T]): Unit = ???
}
```

<!--omit-from-slides start-->
The parameter to the encode() method and the two params of the `send()` method
are normal, 'explicit' params. So when we call the method...
<!--omit-from-slides end-->

```scala
ApiClient1.send(newsTag, tagEncoder)
ApiClient1.send(politicsTag, tagEncoder)
ApiClient1.send(electionResultsArticle, articleEncoder)
```

<!--omit-from-slides start-->
...we have to supply both parameters, even if it is a bit verbose and repetitive.

To justify the `Encoder` parameter on the `send()` method, lets say `send()`
is doing lots of stuff - transmitting over http, adding API keys, 
cryptographically-signing the request, etc - but we want it to be able to send
lots of different kinds of objects, so it does need a way to know how to encode
the sent object to JSON or whatever.
<!--omit-from-slides end-->

---
## What can 'implicit' code get us?

* can remove _repetitive_ code
<!--omit-from-slides start-->
We can stop having to write the things that are **so** obvious/boring
that we don't really want to have to write them over & over again.
<!--omit-from-slides end-->
* engage powerful functionality with minimal effort
<!--omit-from-slides start-->
Type Classes!
<!--omit-from-slides end-->

---
## We can mark parameters as `implicit`

```scala
object ApiClient2 {
  def send[T](value: T)(implicit encoder: Encoder[T]): Unit = ???
}
```

<!--omit-from-slides start-->
When we do this, we are saying to the compiler that it's totally fine
if the developer doesn't include those paramaters when they call that
method - and we're allowing the compiler to go looking _elsewhere_ for
find what the value of that parameter should be.
<!--omit-from-slides end-->

```scala
ApiClient2.send(newsTag)
ApiClient2.send(politicsTag)
ApiClient2.send(electionResultsArticle)
```

---
## How does the compiler work out what the missing parameter values should be?

_("implicit search" or "implicit resolution")_

* Compiler searches by **TYPE**

```scala
ApiClient2.send(newsTag) // we're missing an `Encoder[Tag]`
ApiClient2.send(politicsTag) // we're missing an `Encoder[Tag]`
ApiClient2.send(electionResultsArticle) // we're missing an `Encoder[Article]`
```

---
## ...the compiler is looking for `implicit` values...

```scala
val tagEncoder: Encoder[Tag] = ... // not eligible to be found by implicit search
implicit val tagEncoder: Encoder[Tag] = ... // eligible to be found by implicit search
```

---
## ...but _where_ is the compiler allowed to look?

<!--omit-from-slides start-->
By saying a parameter is 'implicit', we are allowing the compiler to go looking in
a lot of useful places.
<!--omit-from-slides end-->

Starting from where the method is _called_, asking for a parameter of type `A` or `A[B]`:

1. Local scope
2. Imported code
3. Companion object of `A` (eg `Encoder`)
4. Companion object of `B` (eg `Tag` or `Article`)

---
## Implicit search 1: Local scope

```scala
object NewsService {
  implicit val tagEncoder: Encoder[Tag] = ???
  implicit val articleEncoder: Encoder[Article] = ???
  
  def newsBang(): Unit = {
    ApiClient2.send(newsTag)
    ApiClient2.send(electionResultsArticle)
  }
}
```

<!--omit-from-slides start-->
Here, we're calling `send()` from inside the `newsBang()` method, inside the `NewsService` class.
Putting the implicit vals in the class, or in the `newsBang()` method itself, means that the
vals are available in the regular local scope.
<!--omit-from-slides end-->

---
## Implicit search 2: Imported code

`MyEncoders.scala`:
```scala
object MyEncoders {
  implicit val tagEncoder: Encoder[Tag] = ???
  implicit val articleEncoder: Encoder[Article] = ???
}
```

`NewsService.scala`:
```scala
import MyEncoders._

object NewsService {
  def newsBang(): Unit = {
    ApiClient2.send(newsTag)
    ApiClient2.send(electionResultsArticle)
  }
}
```

<!--omit-from-slides start-->
The implicit vals are in a whole other class, but by importing the fields of that class,
they're available for implicit search.
<!--omit-from-slides end-->

---
## Implicit search 3: Companion object of `A`

_(eg `Encoder`)_

```scala
trait Encoder[T] {
  def encode(value: T): String
}

object Encoder {
  implicit val tagEncoder: Encoder[Tag] = ???
  implicit val articleEncoder: Encoder[Article] = ???
}

object NewsService {
  def newsBang(): Unit = {
    ApiClient2.send(newsTag)
    ApiClient2.send(electionResultsArticle)
  }
}
```

<!--omit-from-slides start-->
The compiler knows we are looking for an `Encoder[xxx]` and so it is allowed to search in the
Companion object of `Encoder`.
<!--omit-from-slides end-->

---
## Implicit search 4: Companion object of `B`

_(eg `Tag` or `Article`)_

```scala
case class Tag(id: Long, name: String)
object Tag {
  implicit val encoder: Encoder[Tag] = ???
}

case class Article(id: Long, title: String, tagIds: Seq[Long])
object Article {
  implicit val encoder: Encoder[Article] = ???
}

object NewsService {
  def newsBang(): Unit = {
    ApiClient2.send(newsTag)
    ApiClient2.send(electionResultsArticle)
  }
}
```

<!--omit-from-slides start-->
The compiler knows we are looking for a `xxx[Tag]` and is allowed to search in the
Companion object of `Tag`.

Note that when we are using an 'encoding' library - like Play-Json - we quite often
don't have control over that Encoder class, and can't define a companion object for it -
but this final 4th location, gives us somewhere under our control that we _can_ define it,
because we _do_ control `Tag` and `Article`.
<!--omit-from-slides end-->

---
## Implicit search recap

From where the method is _called_, asking for a parameter of type `A` or `A[B]`,
the compiler searches these in order:

1. Local scope
2. Imported code
3. Companion object of `A` (eg `Encoder`)
4. Companion object of `B` (eg `Tag` or `Article`)

* must find just **one**

<!--omit-from-slides start-->
If, after step 2 or 4, there are two-plus matches, the compiler will give an
"ambiguous implicit values" error - it needs to find just **one** match of that type!
<!--omit-from-slides end-->

---
## Scala's `implicit` keyword

used in several different ways in Scala 2

1. `def foo(implicit b: Bar)` - implicit _parameters_
2. `implicit val` - implicit _values_
3. `implicit class` - _extension_ methods
4. `implicit def` - implicit _conversions_


---
## `implicit` Use 1: implicit parameters

Automatically supply arguments to methods.

```scala
object Supermarket {
    def price(item: String)(implicit c: Currency): Int = ???
    
    def priceShoppingList(items: Seq[String])(implicit c: Currency) =
        items.map(price).sum
}

implicit val c: Currency = Currency.getInstance("GBP")
Supermarket.price("apple") // this time, the currency is implicit 
Supermarket.price("banana")
Supermarket.price("trebuchet")
Supermarket.price(Seq("apple", "trebuchet"))
```

---
## `implicit` Use 2: implicit values (`implicit val`)

Declare a value available when the compiler searches for implicits

```scala
implicit val c: Currency = Currency.getInstance("GBP")
Supermarket.price("apple") // this time, the currency is implicit 
Supermarket.price("banana")
Supermarket.price("trebuchet")
Supermarket.price(Seq("apple", "trebuchet"))
```

---
## `implicit` Use 3: Extension methods (`implicit class`)

Extension methods – Add methods to existing types by wrapping them in an implicit conversion.

```scala mdoc
implicit class StringOps(s: String) {
    def shout = s.toUpperCase + "!"
}

val str = "Roberto is the coolest"

str.shout
```

---
## `implicit` Use 4: Implicit conversions (`implicit def`)

Implicit conversions – Automatically convert one type to another when needed.

```scala mdoc
case class Foo(n: Int)

implicit def intToFoo(i: Int): Foo = Foo(i)

def giveMeFoo(foo: Foo): Unit = println(s"My foo is ${foo}")

giveMeFoo(12) // works, because we're implicitly converting it using `intToFoo()`
```

* Initially very popular
* Discouraged these days

---
## implicit Type Classes as Type Constraints

```scala mdoc:silent
def sort[A: Ordering](xs: List[A]) = xs.sorted
```

```scala
def encode[A: Encoder](a: A) = ...
// expands to
def encode[A](a: A)(implicit enc: Encoder[A]) = ...
```

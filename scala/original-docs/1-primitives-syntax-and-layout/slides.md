# Scala School 2026

---

## Prerequisites

Scala runs on the JVM (Java Virtual Machine), so **you must have Java installed** on your computer in order to run Scala code.

<!--omit-from-slides start-->
You can install [Java](https://www.java.com/en/) in a number of different ways. See the Guardian's [Java update guide](https://docs.google.com/document/d/1ZR-YnaXCT5_gLVmTCeGs0mWd3KPaAozPjQK8uUzHZ9w/edit?usp=sharing) for more details on installation and preferred versions. 
You can install Java by using [`mise`](https://mise.jdx.dev/getting-started.html). 
<!--omit-from-slides end-->
To install the AWS Corretto 25 version of Java, you can use the following command:
```shell
$ mise install java@corretto-25
```

You'll also need to download [`sbt`](https://www.scala-sbt.org/) which you can do using `mise` as well:
```shell
$ mise install sbt@latest
```

`sbt` (Scala Build Tool) is the tool that builds our Scala project for us.

---

## Getting started

### Which IDE

IntelliJ is the Guardian's recommended IDE for working with Scala. [See IntelliJ installation instructions here](https://docs.google.com/document/d/1_0VXjwxfZknh2C0qlT9yZ-JkbAU7Q__U1fWHOT1zdGo/edit?tab=t.0#heading=h.ncxfzlwm1i7h).

You can also use VSCode, by installing the [Metals](https://scalameta.org/metals/docs/editors/vscode) extension.

---

### Setting up a new project

See https://www.scala-sbt.org/1.x/docs/sbt-by-example.html for instructions on how to set up a new Scala project using SBT.

It is also possible to run a command that generates a project structure from scratch to speed things up. e.g.
```
$ sbt new scala/scala-seed.g8
```
which uses giter8, an sbt project generator, https://github.com/scala/scala-seed.g8.

This will generate a project using Scala 2. 

We'll be using Scala 2 throughout this course but Scala 3 is also available, with slightly different syntax in places.

---

The previous command will generate a project with a structure similar to this:
```
.
└── scala-seed-project/
    ├── project/
    │   ├── build.properties
    │   └── Dependencies
    ├── src/
    │   ├── main/
    │   │   └── scala/
    │   │       └── example/
    │   │           └── Hello
    │   └── test/
    │       └── scala/
    │           └── example/
    │               └── HelloSpec
    ├── .gitignore
    └── build.sbt
```

Notice how we have a `build.sbt` file at the root, a little like a `package.json` in Node.

---

### build.sbt

This describes how the project will be built and processed. It sets some configuration and metadata for your package:
- which scala version you're using
- the current version of your package
- the organisation name and prefix for your package
- library dependencies to install

```scala
ThisBuild / scalaVersion := "2.13.12" // scala version
ThisBuild / organization := "com.gu" // organisation identifier

lazy val hello = project
  .in(file("."))
  .settings(
    name := "Hello", // project name
    libraryDependencies ++= Seq( // dependencies
      "org.scala-lang" %% "toolkit" % "0.1.7",
      "org.scala-lang" %% "toolkit-test" % "0.1.7" % Test
    )
  )
```

---

#### Organization

It's common in Scala to use a reverse domain as your package prefix. For example if your company domain was www.example.com, the package name would be prefixed with `"com.example"`.

For example, [Apache](https://apache.org/) has a Scala package called Log4j. The name of the package is [`org.apache.logging.log4j`](https://mvnrepository.com/artifact/org.apache.logging.log4j) where we have reversed the domain name and used that to prefix the package name. 


The Guardian used to own the domain `gu.com` so prefixed the Scala packages with the string `com.gu`. The `gu.com` domain has since been sold but we still use this organisation prefix today. 

```scala
ThisBuild / organization := "com.gu" // organisation identifier
```

<!--omit-from-slides start-->
You can see the Guardian's published Scala packages here: https://mvnrepository.com/search?q=com.gu
<!--omit-from-slides end-->

#### Dependencies

Describes which other libraries or packages you need to install in your project.
The syntax for installing Scala packages is:
```scala
  // <organisation> %% <library> % version
  "org.playframework" %% "play-json" % "3.0.6"
```

<!--omit-from-slides start-->
_You can learn more about SBT and how to set up a project in Lesson 3 of Get Programming With Scala by Daniela Sfregola._
<!--omit-from-slides end-->

---

## Basic Syntax

### Values and Variables

- **Variables** are mutable (can be reassigned)
- **Values** are immutable (cannot be reassigned)

**Variables** are defined using the keyword `var`. These are uncommon.
```scala
var changeMe: String = "I can be changed later"
changeMe = "I have changed"
println(changeMe) // prints "I have changed" to the console
```

It is much more common to use `val`, the **value** keyword.

```scala
val number: Int = 123
number = 456 // error
```

These are evaluated _eagerly_ at declaration time. 
If you don't need your value or variable until a certain point in the program, you might choose to make it `lazy` where it will only evaluate when it is being used.

```scala
// Will be evaluated only when used
lazy val hello: String = "hello!"
```

---

Scala is a **statically typed** language which must be compiled before it is run. It enforces type safety at compile-time. It can **infer** types based on the code that has been written already (type inference).

<!--omit-from-slides start-->
When the types are simple and obvious, we can omit the types from our code and leave Scala to infer them. In most other scenarios, it's best to explicitly define them in our code.
<!--omit-from-slides end-->

Examples of Scala types:
- `String`
- `Int`
- `Float`
- `Double`
- `Long`
- `Boolean`
- `List`
- `Option` (`Some` or `None`)
- `Either` (`Left` or `Right`)
- `Future`
- `Unit`

We'll come to some of these in more detail later.

<!--omit-from-slides start-->
Here are a list of core types in Scala 2: https://www.scala-lang.org/api/2.13.5/scala/index.html
<!--omit-from-slides end-->

---

### Comments

```scala
// I am a single line comment
val bigNumber: Long = 9876543210

/**
 * I am a multi-line comment
 * I can also act as documentation for the line underneath
 */
def myFunction(): Unit => {}
```

---

### Print statements

`println` is a function that prints to the console. We call it with the argument we want to print:

```scala
// Print the text "Hello world!" to the console
println("Hello world!")
```

### String interpolation

_s_ interpolator

Put the letter "s" before a string and use `$` to dynamically insert statements

```scala
// "s" interpolator
val colour = "blue"
println(s"My favourite colour is $colour")

// Using blocks 
println(s"My favourite colour is ${"dark " + colour}")
```

---

### Blocks

You can combine expressions by surrounding them with `{}` which is called a "block". This is a group of code which is evaluated together. 

The following example shows the `println` function being called with a block of code which evaluates to the string "Hello world!"

```scala
println({
  val hello = "Hello"
  hello + " world!"
})
// Prints "Hello world!"
```

In Scala, we very rarely explicitly `return` anything. The result of a block is the last line evaluated in that block.

```scala
// The following block of code calculates values for `two` and `three`
// but returns Unit at the end because the `println` is the last statement evaluated
val result = {
  val two = 1 + 1
  val three = two + 1
  println("4") // last line is the result of the block
}
```

---

### Operations

Mathematical operations work in a similar way to other programming languages.
For example:

```scala
val addition = 1 + 2 // 3
val addition2 = addition += 1 // adds 1 to the `addition` value
val subtraction = 2 - 1 // 1 

val multiplication = 2 * 2 // 4
val division = 1 / 2 // 0.5
val modulo = (2 + 1) % 2 // 1

val equals = 1 == 1 // true
val doesNotEqual = 1 != 2 // true
```

Note `==` double equals means "is equal to", `=` single equals is for _assignment_.

---

### Collections

**Lists**

Lists in Scala are **immutable** ie. there are no operations or methods that can mutate the original data.

```scala
// List is both a type and a constructor.
// Square brackets for the type, standard brackets for the constructor
val myList: List[Int] = List(1, 2, 3) 

// head of the list
myList.head // 1
// tail of the list
myList.tail // List(2, 3)

// destructures head and tail from myList as above
val head :: tail = myList

// add 0 to start of list
0 :: myList // List(0, 1, 2, 3)
// add 4 to end of list
myList :: 4 // List(1, 2, 3, 4)

val anotherList = List(9, 8, 7)

// combine both lists into one
myList ++ anotherList // List (1, 2, 3, 9, 8, 7)
```

Other types of collections available include [`Set`](https://docs.scala-lang.org/overviews/collections-2.13/sets.html) (a collection with no duplicates), [`Seq`](https://docs.scala-lang.org/overviews/collections-2.13/seqs.html) (sequences), [`Map`](https://docs.scala-lang.org/overviews/collections-2.13/maps.html) (a collection of key value pairs).

You can see more types of collections in [the Scala documentation](https://docs.scala-lang.org/overviews/collections-2.13/introduction.html) and we'll cover these in more detail in lesson 2!

---

### Conditional Constructs & Loops

#### If-else

If-else is very similar in Scala as it is in other programming languages.
```scala
if (condition) {
  // expression
} else if (otherCondition) {
  // expression
} else {
  // expression
}
```
e.g. 
```scala
def label(n: Int) = {
  if (n == 0) {
    "neutral"
  } else if (n < 0) {
    "negative"
  } else {
    "positive"
  }  
}
```

Notice how each of these is a *block* of code. You can omit the blocks if your expression can be evaluated on one line, like so:

```scala
def label(n: Int) = {
  if (n == 0) "neutral"
  else if (n < 0) "negative"
  else "positive"
}
```
_The above example was taken from Lesson 5 of Get Programming with Scala by Daniela Sfregola_

---

#### While loop

Rarely used in Scala but here as information:

```scala
while (condition) {
  expression
}
```

Example
```scala
def greet(times: Int) = {
  var i = times 
  while (i > 0) {
    println("Hello world!")
    i -= 1 // subtract 1 from i
  }
}
```

---

#### For loop
```scala
for (condition) {
  expression
}
```

Example
```scala
def greet(times: Int) = {
  for (i <- 1 to times) {
    println("Hello world!")
  }
}
```

---

### Functions

Functions are blocks of code that provide instructions on how to achieve a specific task. 
Function declarations in Scala have:
- a keyword: `def`
- a function name
- function arguments and their types
- a return type of the function
- the function body

```scala
def functionName(argument1: <Type>, argument2: <Type>): <Type> = {
  // function body
}
```

For example, the function `add` can be written like so:

```scala
def add(x: Int, y: Int): Int = x + y
```

Or the function `greet` which prints a greeting:

```scala
def greet(name: String): Unit = println(s"Hello, $name!")
```

<!--omit-from-slides start-->
It is often good practice to think about your types before your implementation.
Scala provides a symbol to allow us to think like this: `???`
This allows you to write your function declaration first without the function body, simply leaving `???` as a `TODO` comment for yourself which essentially stands for "not implemented yet". This allows the code to compile without being complete.
<!--omit-from-slides end-->

`???` as a placeholder:

```scala
def notImplementedYet(input: Any): Unit = ???
```
---

Anonymous functions are functions without names. These are useful when providing functions directly as arguments to other functions.

```scala
{ (x: Int, y: Int) => x + y }
```

Functions can be assigned as _values_ in Scala. So the following is valid too, just as `const` can be used in Javascript:

```scala
// String => Unit is the type of the greet function
// It takes a String as an argument and returns a Unit type
val greet: String => Unit = 
  // The greet function implementation is below
  (name: String) => println(s"Hello, $name!")
```

In general, you should think of `def` when implementing functions as you will usually want a _method_.

<!--omit-from-slides start-->
For more information on functions, read Lesson 6 of _Get Programming with Scala_ by Daniela Sfregola.
<!--omit-from-slides end-->

---

### Methods

Methods are functions available to classes and objects. They can be public or private.

For example:
```scala
object Hello {
  // main is a public method on the Hello object
  def main(args: Array[String]): Unit = {
    println("Hello")
  }

  // topSecret is a private method on the Hello object
  private def topSecret(): Unit = {
    println("shhh")
  }
}
```

This means I can't access the `topSecret` method from outside of the scope of `Hello`, but I can access the `main` one.

We'll go into more detail about classes and objects in lesson 3!

---

## Homework

Set up your own Scala project by following the example in the SBT set up guide: https://www.scala-sbt.org/1.x/docs/sbt-by-example.html

Focus on getting up to the [Scala REPL usage section](https://www.scala-sbt.org/1.x/docs/sbt-by-example.html#Use+Scala+REPL)

Try adding some more logic into your `Hello.scala` program and running it.
Try running the `console` command in `sbt` with some of the examples in this lesson.

## Additional Reading

Lessons 4, 5 and 6 of _Get Programming with Scala_ by Daniela Sfregola.

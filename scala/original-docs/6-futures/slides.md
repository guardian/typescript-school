# Futures

https://docs.scala-lang.org/overviews/core/futures.html

## Why?

Futures exist because we often want to execute multiple tasks at once. There are two kinds of tasks where this is useful:

- IO-bound
- CPU-bound

IO-bound tasks often involve dealing with **networks** and **file systems**, places where the speed of your program is limited (bound) by how quickly you can read or write data. By contrast, in CPU-bound tasks, the speed of your program is limited (bound) by how quickly your processor can run operations.

## IO-bound Program: Web Server

Web servers are a common example of a program that experiences a lot of IO-bound tasks. Not only are they receiving, and sometimes sending, a lot of network requests, they may also be reading and writing to files and databases.

## A Blocking Web Server

Imagine a web server that receives a GET request on the endpoint `/article/:id`. First it makes an internal network request to retrieve data about that article from a database, then it loads an HTML template from the file system and puts the two together to create a document. Finally it sends that document back with a status of OK.

While it's waiting for requests it listens to a socket and does nothing else. When it's looking up the article it waits for the database to respond and does nothing else. When it loads the template it waits for the OS to return data from the file system and does nothing else. It's IO-bound, limited by the performance of the network and the file system, but also blocking, meaning that it can't do anything else while any of these operations are in progress.

As long as it has finished responding to one request before another comes in, the performance is probably acceptable.

## Multiple Requests

Imagine a second request comes in while the first is still being processed. The second request has to wait until the first request has been handled, the database response has come back, the file system read has completed, the response has been sent, and finally the server has started listening on the socket again.

This is an inefficient use of resources, because for most of the time that is spent processing the first request, the CPU is idle, waiting for IO to complete. It could be dealing with the second request while waiting, but it's not because this web server is blocking.

## Context-Switching

It would be nice if our program could do other things while waiting for these IO tasks to complete. To put it another way, it would be nice if it could complete tasks **concurrently**. Starting task A, moving on to task B while waiting, and then coming back to deal with task A at a later time.

Futures can provide an abstraction for doing this.

## Future Examples

Futures are containers for values that may exist in the future. They are generic, meaning they can hold many different types of data.

```scala
val config: Future[String] = loadConfigFromDisk()
val numberOfArticles: Future[Int] = countArticlesInDatabase()
val isSupporter: Future[Boolean] = checkIfUserIsSupporter()
```

## Creating A Future

You can create a Future using its `apply` method, which is called implicitly like this:

```scala
val someFuture: Future[String] = Future {
    loadDataFromDisk()
}
```

The computation described by this call will be started, and its result will be made available in the Future once it has completed. This is **non-blocking**, the Future itself is available to use as a value and be passed around your program straight away, whether or not the computation inside it is done and a result exists yet.

## `Future.value`

Due to its asynchronous nature, it's not straightforward to get the value out of a Future. You can use the `value` method:

```scala
val someResult: Option[Try[String]] = someFuture.value
```

But there's no guarantee the Future has completed yet, which means the result is an `Option`. Whether that might be a `Some` or a `None` at a given point in your program is often non-deterministic.

This means that, in many cases, if a method creates or uses a Future then it often returns a Future as well, leaving the job of unwrapping the result to a consumer further up the tree.

## Using The Result

Instead of attempting to get the value out of the Future directly, we typically register functions (callbacks) to handle the result when it eventually becomes available.

```scala
someFuture.onComplete {
    case Success(value) => println(s"Succeeded with $value")
    case Failure(error) => println(s"Failed with $error")
}
```

## Failures

The function passed to the `onComplete` handler takes a `Try` as its parameter. This is because Futures can complete successfully, or fail with an exception.

```scala
def onComplete[U](f: Try[T] => U)(...): Unit = ???
```

A `Try` is either a `Success`, containing a value, or a `Failure`, containing a `Throwable`. The elided second parameter list is covered later.

## CPU-bound Tasks

Interleaving tasks is often known as "concurrency", and can work well for IO-bound operations.

However, if your tasks are CPU-bound, putting them in a `Future` so that they can run concurrently is, on its own, not going to make things faster. The CPU is not idly waiting for something to happen in that case, it needs to do the work itself.

Task A will take a certain amount of time to complete, and Task B will take a certain amount of time to complete. Interleaving them will not bypass that, and may actually slow things down a bit due to the overhead of context-switching. To make things faster, the tasks need to be run in **parallel**.

## Concurrent vs Parallel

Consider people in a workplace. Individuals can do work concurrently, teams can do work in parallel. If you send an email, you probably won't just sit and wait for a response. You might go and talk to someone, attend a meeting, or write some code in the time it takes to get a reply. When you get that reply, you can act on it. This is concurrency, swapping between different tasks while you're waiting.

But you can't do all of those tasks in parallel. You can't respond to the email, and attend the meeting, and write some code all at the same time. However, if the tasks are spread across a team of people, they *can* all be worked on at the same time. One person responds to an email, another attends a meeting, and the third writes some code. The members of the team are working in parallel.

This is how multi-core CPUs work too. A single core can perform tasks concurrently, swapping back and forth. Multiple cores can operate on several tasks at the same time, in parallel.

## Threads

Threads are the way programs gain the ability to schedule multiple tasks at once, and they are relevant for both concurrency and parallelism, IO-bound and CPU-bound tasks. You can create "pools" of threads and give them work to complete on the side without blocking your main thread. Some pools are optimised for IO-bound operations, for example spinning up new threads dynamically to sit and wait for blocking IO operations to complete. Others are optimised for CPU-bound operations, for example maintaining a static number of threads, one for each CPU core.

## Execution Context

Execution contexts are Scala's way to handle the scheduling of tasks that you want to run asynchronously with Futures. You can use different execution contexts depending on the nature of the tasks being executed (e.g. IO-bound or CPU-bound), and the implementation usually involves a thread pool.

Your program might generally be doing the same kind of work, in which case it may use the same execution context for everything. Or you might specify different execution contexts for areas of work with different performance profiles.

For this reason, when you're working with Futures you often have to specify an execution context for the work the Future will be doing, so that Scala knows where and how to run it.

## Setting the Execution Context

You can provide the execution context implicitly for the methods that need it:

```scala
import scala.concurrent.{Future, ExecutionContext}

implicit val ec = ExecutionContext.global

// `ec` used implicitly by the `Future.apply` method
val someFuture: Future[String] = Future {
    getSomeData()
}

// `ec` used implicitly by the `onComplete` method
someFuture.onComplete {
    case Success(value) => println(s"Succeeded with $value")
    case Failure(error) => println(s"Failed with $error")
}
```

This example uses Scala's default global execution context.

## Callbacks

The full definition of the `onComplete` method, partially described earlier, looks like this:

```scala
def onComplete[U](f: Try[T] => U)(implicit executor: ExecutionContext): Unit = ???
```

When you're registering a callback, where and how this callback runs is determined by the execution context that's provided. This could be *somewhere different* to the original Future. The original Future might do some IO-bound work, and be run using an execution context optimised for this. But the result might be used in a CPU-intensive computation, and thus run using a different execution context optimised for that. This is why execution contexts are usually provided as arguments each time.

## Other Methods

`onComplete` is not the only way to register a callback to handle the result of a Future.

`foreach` runs the callback only when the result is a `Success`:

```scala
someFuture.foreach { value => println(s"Succeeded with $value") }
```

`recover` runs the callback only when the result is a `Failure`:

```scala
someFuture.recover { error => println(s"Failed with $error") }
```

Other examples include `recoverWith` and `fallbackTo`, which offer alternative ways to handle the failure case, and `andThen`, which can run arbitrary side-effects with the result when the Future is complete.

## Await

While there are several callback-based, asynchronous APIs for dealing with Futures, there is also `Await`. `Await.ready` and `Await.result` allow you to block the current thread while waiting for a future to complete. The use cases for this are rare; for example, you *might* do this in tests, or inside an AWS lambda to ensure async work has been completed before logging the result and exiting.

```scala
Await.ready(someFuture, 2000.millis)
Await.result(someFuture, 2000.millis)
```

It's important to note that this use of "await" is **different** to how it's used in languages like JavaScript or Rust. There you can only "await" inside asynchronous functions, which suspends the execution of that function but does **not** block the current thread. It marks a position where the program has to wait for some async operation, and therefore can swap to another task, for concurrency. By contrast `Await` in Scala can be used in synchronous code, and blocks.

## FP interface

Some of the most important methods for dealing with Futures are `map`, `flatMap` and `withFilter`. These will be covered in more detail in the next session, along with for comprehensions.

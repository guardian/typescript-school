## Functions

The simplest way to describe a function is with a function type expression. These types are syntactically similar to arrow functions:

```
function greeter(fn: (a: string) => void) {
 fn("Hello, World");
}
```

```
function printToConsole(s: string) {
 console.log(s);
}
```

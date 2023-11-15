## Classes in TypeScript

We'll cover:

- Basic class syntax in JavaScript
- Adding types to class members
- Visibility modifiers
- Modeling class heritage and relationships
- Abstract classes

---

## Question

- What are classes for?
- Why would we use them?

---

## Question

Classes can be useful for grouping related data and behaviour together. They also provide a template for creating objects.

They appear fairly frequently. You might have seen them in [GuCDK](https://github.com/guardian/cdk):

```ts
class GuApiLambda extends GuLambdaFunction {
	/* Snip */
}
const lambda = new GuApiLambda(this, 'lambda', {
	/* Snip */
});
```

---

## The relationship between classes, values and types

Based on what we've learned about TypeScript so far, does anything stand out about this?

```ts
class MyClass {}
const a: MyClass = new MyClass();
```

---

## The relationship between classes, values and types

Until now, we have declared types using TypeScript syntax, and values using JavaScript syntax:

```ts
// TS
type A = number;
interface B {}

// JS
const A = 1;
function B() {}
```

These names (`A` and `B`) don't clash, because they exist in different namespaces: the type and value namespaces.

---

## The relationship between classes, values and types

Classes behave differently. We use the `class` keyword to declare both a type _and_ value with that name:

```ts
class MyClass {}
const a: MyClass = new MyClass();
```

This creates a type `MyClass` in the type namespace, and a value `MyClass` in the value namespace. It is why we can write `new MyClass` as well as use `MyClass` as a type annotation.

---

## Syntax

Classes are made up of _members_. Members represent a class's data and behaviour. We can define:

- fields (data)
- methods (behaviour)
- constructors (behaviour)

With TypeScript, we can add types and other restrictions to class members.

TypeScript helps us use each member correctly.

---

## Syntax

A basic class:

```ts
//     class name
//    ┌─────────┐
class BankAccount {
	// Data fields
	id: number;
	// What type does balance have?
	balance = 0;

	// Constructor
	constructor(id: number) {
		this.id = id;
	}

	// Method
	calculateInterest(): number {
		return this.balance * 0.001;
	}
}
```

---

## Fields

We use fields to store data on the class. With TypeScript, we can specify the field's:

- type, specifying what values can we assign
- visibility, whether the field is public, private or protected or `readonly`

```ts
class BankAccount {
	id: number = 0;
	private balance = 0;
}

const b = new BankAccount();

// ❌
// Property 'balance' is private and
// only accessible within class 'BankAccount'
b.balance;
// ✅
b.id = 4;
```

---

## Fields

It's worth remembering that specifying a field's visibility in this way in TypeScript gives no runtime protection of these fields.

```ts
// TS
class BankAccount {
	readonly id: number = 0;
	private balance = 0;
}
```

```js
// JS
class BankAccount {
	constructor() {
		this.id = 0;
		this.balance = 0;
	}
}
const b = new BankAccount();
b.id = 50;
console.log(b.id); // 50
```

---

## Constructors

- Like regular functions, we can (and should!) specify parameter types
- We can't specify a return type! Constructors always return the class instance type

```ts
class BankAccount {
	// ... Snip
	private id: number;
	constructor(id: number) {
		this.id = id;
	}
	// ... Snip
}
```

---

## Constructors

We can use the constructor signature to specify a class's fields along with their respective visibility and writeability. These are called **Parameter Properties**. We must prefix them with a visibility modifier (`private`, `protected`, `public`, `readonly`).

```ts
class BankAccount {
	constructor(
		readonly id: number,
		private balance: number,
	) {}
}

// Is equivalent to

class BankAccount2 {
	readonly id: number;
	private balance: number;
	constructor(id: number, balance: number) {
		this.id = id;
		this.balance = balance;
	}
}
```

---

## Member Visibility

Member visibility controls where we can see each member (fields and methods) from. There are 4 modifiers:

- `readonly` fields. We cannot normally write to `readonly` fields
- `public`. This is the default. We can see `public` members from anywhere
- `protected`. We can see `protected` members from subclasses
- `private`. We can only see `private` members from inside the declaring class

You can use `readonly` alongside `public`, `protected` and `private`.

---

## `readonly` fields

The `readonly` visibility modifier can be applied to fields. It states that the field cannot normally be assigned a value. There are two exceptions:

- the field initialiser
- in the constructor

```ts
class BankAccount {
	readonly id: number;
	readonly accountType = 'student';
	constructor(id: number) {
		this.id = id;
	}
}
```

---

## Member Visibility

```ts
class BankAccount {
	protected balance: number = 0;
	private createdDate: Date = new Date();
	name: string = 'Jane';
}
class KidsBankAccount extends BankAccount {
	public deposit(amount: number) {
		// ✅, balance is protected
		this.balance += amount;
	}

	withdraw(amount: number) {
		// ❌, createdDate is private
		if (this.createdDate) {
			/* Snip */
		}
	}
}
```

---

## Member Visibility

```ts
class BankAccount {
	protected balance: number = 0;
	private createdDate: Date = new Date();
	name: string = 'Jane';
}
class KidsBankAccount extends BankAccount {
	public deposit(amount: number) {
		/*Snip*/
	}
	public withdraw(amount: number) {
		/*Snip*/
	}
}
const b = new BankAccount();
const kids = new KidsBankAccount();

// ❌
b.balance;
b.createdDate;
kids.balance;
kids.createdDate;

// ✅
b.name;
kids.name;
kids.deposit(15);
```

---

## Private members

JavaScript also has syntax for defining a private member:

```js
class MyClass {
	#myPrivateMember = 0;
}
```

What's the difference between `#` and TypeScript's `private`?

---

## Private members

In TS-land, nothing! TypeScript will treat them both as private members. The main difference is in the JS that the TypeScript compiler generates:

```js
class MyClass {
	#myPrivateMember = 0;
}
// generates...
var _MyClass_privateMember;
class MyClass {
	constructor() {
		_MyClass_privateMember.set(this, 0);
	}
}
_MyClass_privateMember = new WeakMap();
```

This provides _some_ runtime privacy of the member.

---

## Private members

```js
class MyClass {
	private myPrivateMember = 0;
}
// generates...
"use strict";
class MyClass {
    constructor() {
        this.privateMember = 0;
    }
}
```

This provides _no_ runtime privacy of the member. It's effectively public!

---

## Getters & Setters

```ts
class BankAccount {
	private _balance: number = 0;

	get balance(): number {
		return this._balance;
	}

	set balance(b: number) {
		/* Snip */
	}
}
```

---

## Getters & Setters

1. Even though the member field is private, it can't share a name with the getter/setter in `2`
2. The getter's name
3. If we omit the setter's parameter type, TypeScript infers it from the getter's return type
4. TypeScript prevents us from setting values of an incorrect type

```ts
class BankAccount {
	//      ┌───1───┐
	private _balance: number;

	constructor() {
		/* Snip */
	}

	//  ┌───2───┐
	get balance(): number {
		return this._balance;
	}

	//        ┌─3─┐
	set balance(b) {
		/* Snip */
	}
}
const b = new BankAccount();
// ❌        ┌──4─┐
b.balance = '12.30';
```

---

## Getters & Setters

What is the implication of this snippet? We have a getter but no setter.

```ts
class BankAccount {
	private _balance: number = 0;
	get balance(): number {
		return this._balance;
	}
}
```

---

## Getters & Setters

When we have a getter but no setter, the field is effectively `readonly`

```ts
class BankAccount {
	private _balance: number = 0;
	get balance(): number {
		return this._balance;
	}
}
```

---

## Class Heritage

Classes can inherit members from other classes. There are two mechanisms:

- `extends` clauses
- `implements` clauses

---

## Class Heritage - `extends`

With `extends`, we can inherit members from a base class. We can also define new methods and fields on the "derived" class.

```ts
class Base {
	field1: number = 10;
}

class Derived extends Base {
	field2: number = 5;
	sum() {
		return this.field1 + this.field2;
	}
}
const d = new Derived();
console.log(d.sum()); // 15;
```

---

## Class Heritage - `implements`

The `implements` clause is a TypeScript addition. We use `implements` to tell TypeScript that the class has certain members. It says nothing about the _implementation_ of those members.

```ts
interface BankAccount {
	readonly balance: number;
	deposit(amount: number): void;
	withdraw(amount: number): void;
}

// ❌
// Class 'KidsBankAccount' incorrectly implements interface 'BankAccount'
class KidsBankAccount implements BankAccount {}
```

---

## Class Heritage - `implements`

**Warning:** the `interface` must have a different name to the `class`.

The `interface` creates a type in the type namespace, and the `class` creates a type in the type namespace _and_ a value in the value namespace.

If they have the same name, they will clash in the type namespace.

```
   type namespace          value namespace
      ┌──────┐                ┌──────┐
      │      │                │      │
      │  A   │◄───┐           │  A   │
      │      │    │           │      │
      └──────┘    │           └───┬──┘
         ▲        │               ▲
         │     ┌──┴─────────────┐ │
         │     │ interface A {} │ │
         │     │                │ │
         └─────┤ class A {}─────┼─┘
               └────────────────┘

```

---

## Class Heritage - `implements`

Classes can implement multiple interfaces:

```ts
interface Printable {
	print(): void;
}

interface Loggable {
	log(): void;
}

class Thing implements Printable, Loggable {
	print(): void {}
	log(): void {}
}
```

---

## Relationships between classes

Classes in TypeScript are compared _structurally_. If two classes have the same members with matching visibility modifiers, they are equivalent.

```ts
class Class1 {
	value: number = 0;
	print(): void {
		console.log(this.value);
	}
}
class Class2 {
	value: number = 100;
	print(): void {
		console.log(this.value);
	}
}
// ✅
const a: Class1 = new Class2();
```

---

## Relationships between classes

```ts
class Class1 {
	private a: number = 0;
}

class Class2 {
	a: number = 0;
}
// ❌
// Property 'a' is private in type 'Class1' but not in type 'Class2'
const a: Class2 = new Class1();
```

---

## Abstract

The `abstract` modifier on fields and methods means they do not have an implementation provided. Abstract class members can only exist on an `abstract` class.

```ts
// ❌ This is a concrete class. It can't have abstract members.
class MyClass {
  abstract myProp: number = 0;
}

// ✅ This is an abstract class. It can have abstract and concrete members.
abstract class MyClass {
  abstract myProp: number = 0 ;
}
```

---

## Abstract

Abstract classes can't be directly instantiated; they must be subclassed.

```ts
abstract class BankAccount {
	readonly balance: number = 0;
	abstract calculateInterest(): number;
}

class CurrentAccount extends BankAccount {
	calculateInterest() {
		return 0.001;
	}
}
```

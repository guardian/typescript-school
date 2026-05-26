# Primitive Types

TypeScript primitives are the most basic building blocks of the TypeScript type system. They represent simple, immutable values

There's a chapter on them in the TypeScript handbook: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

---

## Basic TypeScript Primitives

- **number**: Represents numeric values, including integers and floating-point numbers.
- **string**: Represents textual data enclosed in single or double quotes.
- **boolean**: Represents a binary value, either true or false.
- **null**: Represents the intentional absence of any value or object.
- **undefined**: Represents a variable that has been declared but hasn't been assigned a value.
- **symbol**: Represents a unique and immutable value often used as object property keys.

---

## Type Inference for Primitives

TypeScript often infers the types of primitives based on their initial values. For example, if you declare

```ts
const age = 30;
```

TypeScript infers `age` as a number.

---

## Type Annotations for Primitives

You can explicitly specify the type of a variable using type annotations. For example,

```ts
const name: string = 'John';
```

---

## Type Aliases

You can create custom type aliases using type to make your code more readable. For example,

```ts
type Age = number;
```

allows you to use `Age` instead of number for clarity.

#### with Unions

```ts
type Currency = 'USD' | 'EUR' | 'GBP'; // Type alias for a currency
type Price = number | string; // Union type for price, which can be a number or a formatted string
```

---

## Union Types

You can define a variable that can hold multiple types using union types. For instance,

```ts
let result: number | string;
```

allows `result` to be either a number or a string.

---

## Literal Types

TypeScript supports literal types, where a variable can only have a specific literal value. For example,

```ts
const something: 'x' | 'y' = 'y';
```

---

## Understanding null and undefined Types

- TypeScript includes two special types, null and undefined, to represent the absence of values or uninitialized variables.
- These types are often used in scenarios where values might be missing or not assigned.

---

## Understanding null and undefined Types

### The null Type

- null represents the intentional absence of any value.
- It is often used to indicate that a variable is deliberately empty or has no assigned value.
- For example, when a user hasn't selected an option, a variable can be set to null.

```ts
// Using null to represent an empty value
let selectedOption: string | null = null;

if (userHasMadeSelection) {
	selectedOption = userSelection;
}
```

---

## Understanding null and undefined Types

### The undefined Type

- `undefined`` represents a variable that has been declared but hasn't been assigned a value.
- It signifies that a variable exists, but its value is not defined.
- Variables declared without initialization are automatically assigned the undefined value.

```ts
// Demonstrating undefined for uninitialized variables
let uninitializedVariable: string | undefined;

if (conditionIsMet) {
	uninitializedVariable = 'Initialized value';
}
```

Using null and undefined

null and undefined can be assigned to variables, function parameters, and object properties.
They can be explicitly assigned to indicate the absence of data or uninitialized values.

---

## Bringing these together

- see `week2-examples.ts`

---

## Type Guards

Type guards are functions that help narrow down the type of a value within a conditional block. For instance,

```ts
if (typeof value === 'string') { /* value is a string here */ }.
```

This will be delved deeper in session 4 however.

---

## TypeScript-specific Primitives

TypeScript also supports other advanced primitive types like bigint for arbitrary-precision integers, void for functions that don't return a value, and never for functions that never return (e.g., throw errors).

---

## TypeScript-specific Primitives

### BigInt

BigInt is used to represent arbitrarily large integers. It's useful when you need to work with integers larger than the maximum safe integer value in JavaScript, which is Number.MAX_SAFE_INTEGER.

```ts
let bigNumber: bigint = 1234567890123456789012345678901234567890n;
```

---

## TypeScript-specific Primitives

### Void

The void type is typically used for functions that do not return a value or return undefined. This is often the case for functions with side effects but no meaningful return value.

```ts
function logMessage(message: string): void {
	console.log(message);
}
```

In this example, the throwError function never returns a value because it always throws an error, preventing the program from continuing.

---

## TypeScript-specific Primitives

### Never

The never type represents values that never occur. It is often used for functions that always throw an error or never reach the end.

---

#### Real-World Scenario 1: Throwing Errors

Suppose you have a function that's expected to throw an error in exceptional circumstances. This function should have a return type of never because it never normally returns:

```ts
function throwError(message: string): never {
	throw new Error(message);
}
```

In this scenario, never conveys the intention that the function never completes normally, as it always throws an error, preventing the program from continuing.

---

### Type Inference with Functions

TypeScript infers the return type of functions based on their implementation. Explicitly annotating return types is often not required.

TypeScript infers the return type of this function

```ts
function add(a: number, b: number) {
	return a + b;
}
```

The return type of the function 'add' is inferred as 'number'

```ts
const result = add(5, 3); // result is of type 'number'
```

In the example above:

The add function takes two parameters, a and b, both of type number.

TypeScript uses type inference to determine that the return type of the add function is number because it's clear that the function returns the sum of two numbers.

---

## Understanding Object Types in TypeScript

Object types in TypeScript are a fundamental concept that allows you to define the shape and structure of objects. They play a vital role in making your code more predictable and safe.

### Object Type Basics

An object type is essentially a blueprint for an object. It specifies the properties an object should have, along with their respective types. For example, you can define an object type representing a person:

```ts
type Person = {
	name: string;
	age: number;
};
```

In this example, the Person object type defines that a person object must have a name property of type string and an age property of type number.

---

### Using Object Types

You can use object types in various ways:

#### Defining Object Variables:

```ts
const user: Person = { name: 'Alice', age: 30 };
```

---

### Using Object Types

#### Function Parameters:

```ts
function greet(person: Person) {
	console.log(`Hello, ${person.name}!`);
}
```

---

### Using Object Types

#### Object Arrays:

```ts
const people: Person[] = [
	{ name: 'Bob', age: 25 },
	{ name: 'Charlie', age: 35 },
];
```

---

### Using Object Types

#### Object Type Unions:

```ts
type Animal = { name: string; species: string };
type Plant = { name: string; type: string };

type Organism = Animal | Plant;
```

---

### Using Object Types

#### Optional and Readonly Properties:

Object types can also define optional and readonly properties. Optional properties are marked with a ?, and readonly properties are marked with readonly. For example:

```ts
type Book = {
	title: string;
	author: string;
	year?: number; // Optional property
	readonly ISBN: string; // Readonly property
};
```

---

### Using Object Types

#### Index Signatures

Object types can also include index signatures to define properties by a specific pattern. For instance, you can create an object type for a dictionary:

```ts
type Dictionary = {
	[key: string]: string;
};
```

---

#### Intersection Types

You can combine multiple object types into a single type using intersection types. This allows objects to have properties from multiple types.

```ts
type Car = {
	brand: string;
	year: number;
};

type Electric = {
	electric: boolean;
};

type ElectricCar = Car & Electric;
```

---

### Exploring the Record Type in TypeScript

Have you ever needed to create structured data with specific key-value pairs in TypeScript? That's where the Record type comes into play. It's a versatile tool that helps you define objects with known shapes.

#### What is the Record Type?

Think of the Record type as your blueprint for creating structured data. It's like a custom-made map with predefined keys and corresponding value types.

---

#### Creating a Simple Record

Here's how you create a basic record:

```ts
type FruitRecord = Record<'apple' | 'banana' | 'cherry', number>;

const fruitCount: FruitRecord = {
	apple: 5,
	banana: 8,
	cherry: 12,
};

// You can access individual counts like this:
const appleCount = fruitCount.apple; // 5
```

<!-- In this example, we've defined a FruitRecord with keys "apple," "banana," and "cherry," and each key corresponds to a number value. -->

---

Use Cases for Records
Records are particularly handy when you need to:

- Create dictionaries or maps.
- Ensure consistent data shapes across your application.
- Define expected properties for specific data structures.

---

### Combining Object Types and Records

You can combine object types and records to build complex data structures. For instance:

```ts
type Employee = {
	name: string;
	position: string;
};

type EmployeeRecord = Record<number, Employee>;

const employees: EmployeeRecord = {
	101: { name: 'Alice', position: 'Developer' },
	102: { name: 'Bob', position: 'Designer' },
};

// You can access employees by their IDs:
const employee101 = employees[101];
```

<!-- In this example, we've combined an object type Employee with a record to create a map of employees by their employee IDs. -->

---

### Benefits of Using Records

- Ensures data consistency by defining expected keys and value types.
- Makes it easier to manage and work with structured data.
- Offers better type checking and improved code reliability.

---

### Task: Managing Newspaper Articles

```ts
type ArticleRecord = Record<
	string,
	{ title: string; author: string; publicationDate: string }
>;

const articles: ArticleRecord = {
	article1: {
		title: 'Breaking News: New Discoveries in TypeScript',
		author: 'Alice Author',
		publicationDate: '2023-10-19',
	},
	article2: {
		title: 'TypeScript and Modern Web Development',
		author: 'Bob Writer',
		publicationDate: '2023-10-20',
	},
	// Add more articles here
};
```

- Add at least three additional articles to the articles object. Each article should have a unique ID (string), title, author, and publication date.

- Implement a function called addArticle that takes parameters for the article ID and article information and adds the article to the articles object.

```ts
function addArticle(
	articleId: string,
	articleInfo: { title: string; author: string; publicationDate: string },
) {
	// Implement the function to add the article to the articles object
}
```

- Implement a function called deleteArticle that takes an article ID as a parameter and removes the article from the articles object.

```ts
function deleteArticle(articleId: string) {
	// Implement the function to delete the article from the articles object
}
```

- After adding and implementing the functions, use console.log to display the entire articles object in the console.

- Test the addArticle and deleteArticle functions by adding and removing at least one article, and then display the updated articles object in the console.

---

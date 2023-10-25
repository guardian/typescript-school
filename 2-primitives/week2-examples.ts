// Example of use:

type AlbumName = string;

type Album = {
	name: AlbumName;
	copiesSold: number;
};

const albumName: AlbumName = 'Kind of Blue';
albumName;


// Bringing the types together
type Address = {
    street: string;
    city: string;
    zipCode: string;
  };
  
  type Contact = {
    email: string | null | undefined; // Using a union type with null and undefined
    phone: string | null | undefined; // Using a union type with null and undefined
  };
  
  type Person = {
    name: string;
    age: number;
    address: Address | null; // Composing with null
    contact: Contact | undefined; // Composing with undefined
  };
  
  const person1: Person = {
    name: "Alice",
    age: 30,
    address: null, // Using null in the composition
    contact: {
      email: "alice@example.com",
      phone: undefined, // Using undefined in the composition
    },
  };


    // Using Record
  type Employee = {
    name: string;
    position: string;
  };
  
  type EmployeeRecord = Record<number, Employee>;
  
  const employees: EmployeeRecord = {
    101: { name: "Alice", position: "Developer" },
    102: { name: "Bob", position: "Designer" },
  };
  
  // You can access employees by their IDs:
  const employee101 = employees[101];


  // Task
type ArticleRecord = Record<string, { title: string; author: string; publicationDate: string }>;

const articles: ArticleRecord = {
  "article1": { title: "Breaking News: New Discoveries in TypeScript", author: "Alice Author", publicationDate: "2023-10-19" },
  "article2": { title: "TypeScript and Modern Web Development", author: "Bob Writer", publicationDate: "2023-10-20" },
  // Add more articles here
};

function addArticle(articleId: string, articleInfo: { title: string; author: string; publicationDate: string }) {
    // Implement the function to add the article to the articles object
  }

function deleteArticle(articleId: string) {
// Implement the function to delete the article from the articles object
}
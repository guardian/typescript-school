/** Exercise 1
 * Add a type for the following function
 * 
 * A function of type Add2 returns the sum of 2 number parameters
 */

type Add2 = never;

// @ts-expect-error
const add2: Add2 = (n1, n2) => n1 + n2;

/** Exercise 2
 * Add a type for the following function
 * 
 * Returns a function that, when called, multiplies the parameter by 5
 */

type MakeMultiply5 = never;
// @ts-expect-error
const makeMultiply5: MakeMultiply5 = () => (n) => n * 5;
// Example usage
// @ts-expect-error
makeMultiply5()(5) // returns 25

/** Exercise 3
 * Fix the implementation, or the type, of this function
*/

function justLog(msg: string): void {
    console.log(msg);
    // @ts-expect-error
    return msg;
}

/** Exercise 4
 * Using object destructuring, write a function that returns
 * the `name` field from an object of type User, capitalised
 * Example: getName(user) should return FELIX
 */

type User = {
    age: number;
    location: string;
    name: string;
}
const user = {
    age: 58,
    location: "paris",
    name: "Felix"
}

/** Exercise 5
 * Using array destructuring, write a function that returns
 * the first element of the provided array
 * 
 * Example: head(array) should return 1
 */

type MyArray = number[];
const array = [1, 2, 3, 4];

/** Exercise 6 
 * 
 * Write the "implementation" call signature (but not the actual implementation) for the following overloads
*/
type Order = {
    orderId: number;
}
type FetchOrder = {
    (orderId: number): Order[];
    (order: Order): Order;
    // Add the implementation call signature here
}

/** Exercise 7
 * 
 * Add types for this function where the 2nd parameter is optional
 */
//@ts-expect-error
function concat(str1, str2) {
    return `${str1}${str2 ? str2 : ''}`
}

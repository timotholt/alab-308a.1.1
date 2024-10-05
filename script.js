console.log(`hi`);

//===========================================
// Part 1: Stack Overflow
//===========================================

// Declare a global counter variable.
let recursionCounter = 0;

// Create a simple function that increments the variable, and then calls itself recursively.
function countRecursionDepth() {
    recursionCounter++;
    countRecursionDepth();
}

// Surround the initial function call in a try/catch block.
try {
    countRecursionDepth();
}
catch (error) {
    // Within the catch, log the error and the value of the counter variable.
    console.log(`Recursion depth hit!  Recursion counter = ${recursionCounter}`);
    window.alert(`Recursion depth hit! Recursion counter = ${recursionCounter}`);
}

//========================================================
// Part 2: Trampolines
//
// Write a recursive function that completely flattens an
// array of nested arrays, regardless of how deeply nested
// the arrays are.
//========================================================

// Recursive one
function flattenArray(unknownArray) {

    // If we are passed a primative (anything not an array, return it)
    // This starts unwinding the stackssss
    if (!Array.isArray(unknownArray)) {
        return [unknownArray];
    }

    // This is where we flatten
    const flatEarth = [];

    // Go through each element in the array
    for (let i = 0; i < unknownArray.length; i++) {

        // Flatten the array recursively.
        // Then take the result (also an array) and concatenate it onto our local copy
        // let result = flattenArray(unknownArray[i]);
        // for (const r of result)
        //     flatEarth.push(r);

        // This code works and is equivalent to the three lines above 
        flatEarth.push(...flattenArray(unknownArray[i]));
    }

    return flatEarth;
}

// Trampline function
// This is copied right out of the example verbatim
// I don't really understand it.  For real, I just cut and paste this
// from the assignment.

// It takes a recursive function and a list of arguments
const trampoline = (f, ...args) => {

    // invoke the function with the list of arguments
    let result = f(...args);

    // 
    while (typeof result === "function") {
        result = result();
    }
    return result;
}

// Test the recursive version
// Output should be [1, 2, 3, 4, 5, 6]
const nestedArray = [1, [2, 3, [4, 5]], 6];
const flattenedResult = flattenArray(nestedArray);
console.log(flattenedResult);

// Call the trampoline version
const trampolineResult = trampoline(flattenArray, nestedArray);
console.log(trampolineResult); // Output: [1, 2, 3, 4, 5, 6]

//========================================================
// Part 3: Deferred Execution
//
// Write a recursive function that completely flattens an
// array of nested arrays, regardless of how deeply nested
// the arrays are.
//========================================================

const primeNumbersDivBlocking = document.getElementById("primeNumbersBlocking");
const primeNumbersDivNonBlocking = document.getElementById("primeNumbersNonBlocking");

// Where we store the results of the prime
let listOfPrimes = [];

// Blocking version, this one is not deferred
function BLOCKING_findPrimesUpToN(n) {

    // Empty the list
    listOrPrimes = [];

    // Loop through all primes between 2 and n
    for (let i = 2; i <= n; i++) {
        
        let isPrime = true;
        
        // Compare smaller numbers 
        for (let j = 2; j <= Math.sqrt(i); j++) {
            // If we can divide j into i, it's not prime
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }

        // If the number is prime
        if (isPrime) {
            // Add it to the list
            listOfPrimes.push(i);
        }
    }
    primeNumbersDivBlocking.textContent = listOfPrimes.join(", ");
}

//===============================

// Non-blocking version
function NON_BLOCKING_findPrimesUpToN(n) {

    // Empty the list
    listOfPrimes = [];

    // If we haven't printed any primes, don't print a comma
    let printedAnyPrimes = false;
    let calculatingPrimes = true;

    function renderAnyFoundPrimes() {

        // if there are any numbers in our queue
        if (listOfPrimes.length > 0) {

            // If we printed any previous primes, add a comma
            if (printedAnyPrimes) {
                primeNumbersDivNonBlocking.textContent += ", ";
                printedAnyPrimes = true;
            }

            // Add list of primes to output <div>
            primeNumbersDivNonBlocking.textContent += listOfPrimes.join(", ");
            printedAnyPrimes = true;

            // Empty the list
            listOfPrimes.length = 0;
        }

        // Tell the scheduler to call our timeout function again
        if (calculatingPrimes)
            setTimeout(renderAnyFoundPrimes, 200);
    }

    function findPrimesRecursively(i) {

        // Tell other thread we are done
        if (i > n) {
            calculatingPrimes = false;
            return;
        }

        // Think of n as a global here even tho it's parent scope
        if (i <= n) {
            let isPrime = true;

        // Compare smaller numbers
        for (let j = 2; j <= Math.sqrt(i); j++) {

            // If we can divide j into i, it's not prime
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }

        // If it's a prime number, add it to the list
        if (isPrime)
            listOfPrimes.push(i); 

        // Schedule the next iteration after a short delay
        setTimeout(findPrimesRecursively, 0, i + 1);
        }
    }

    // Schedule the next iteration after a short delay
    findPrimesRecursively(2);
    renderAnyFoundPrimes();
}

// Example usage:
//BLOCKING_findPrimesUpToN(10000);
//window.alert("BLOCKING Prime number calculation finished!");

// NON_BLOCKING_findPrimesUpToN(100000);
setTimeout(NON_BLOCKING_findPrimesUpToN(10000), 0);
window.alert("NON-BLOCKING Prime number calculation finished!");

console.log(`bye`);

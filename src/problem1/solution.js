// Problem 1: Three ways to sum to n

function validatedN(n) {
    n = Number(n);
    if (!Number.isFinite(n) || isNaN(n) || n < 0) return 0;
    return Math.floor(n);
}

// Method 1: Iterative approach using a loop
var sum_to_n_a = function(n) {
    n = validatedN(n);
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Method 2: Mathematical formula (the most efficient for large numbers)
var sum_to_n_b = function(n) {
    n = validatedN(n);
    return (n * (n + 1)) / 2;
};

// Method 3: Recursive approach
var sum_to_n_c = function(n) {
    n = validatedN(n);
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
};

// Test cases
console.log("Testing sum_to_n_a (iterative):");
console.log("sum_to_n_a(5) =", sum_to_n_a(5)); // Expected: 15
console.log("sum_to_n_a(10) =", sum_to_n_a(10)); // Expected: 55
console.log("sum_to_n_a(-3) =", sum_to_n_a(-3)); // Expected: 0
console.log("sum_to_n_a(3.7) =", sum_to_n_a(3.7)); // Expected: 6 (sum of 1+2+3)

console.log("\nTesting sum_to_n_b (mathematical):");
console.log("sum_to_n_b(5) =", sum_to_n_b(5)); // Expected: 15
console.log("sum_to_n_b(10) =", sum_to_n_b(10)); // Expected: 55
console.log("sum_to_n_b(-3) =", sum_to_n_b(-3)); // Expected: 0
console.log("sum_to_n_b(3.7) =", sum_to_n_b(3.7)); // Expected: 6

console.log("\nTesting sum_to_n_c (recursive):");
console.log("sum_to_n_c(5) =", sum_to_n_c(5)); // Expected: 15
console.log("sum_to_n_c(10) =", sum_to_n_c(10)); // Expected: 55
console.log("sum_to_n_c(-3) =", sum_to_n_c(-3)); // Expected: 0
console.log("sum_to_n_c(3.7) =", sum_to_n_c(3.7)); // Expected: 6 
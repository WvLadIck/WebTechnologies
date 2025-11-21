function pow(x, n) {
    if (n < 1 || !Number.isInteger(n)) {
        throw new Error("Степень n должна быть натуральным числом (1, 2, 3, ...)");
    }

    let result = 1;
    for (let i = 0; i < n; i++) {
        result *= x;
    }
    return result;
}

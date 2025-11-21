function gcd(a, b) {
    if (b > a) {
        let c = a;
        a = b;
        b = c;
    }

    while (b !== 0) {
        let ost = a % b;
        a = b;
        b = ost;
    }

    return a;
}



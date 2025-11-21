function minDigit(x) {
    let minDig = 10;

    while (x > 0) {
        let ost = x % 10;
        x = (x - ost) / 10;
        if (ost < minDig) {
            minDig = ost;
        }
    }

    return minDig;
}

function getSortedArray(array, key) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        result[i] = array[i];
    }
    for (var i = 0; i < result.length - 1; i++) {
        for (var j = 0; j < result.length - 1 - i; j++) {
            if (result[j][key] > result[j + 1][key]) {
                var temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }

    return result;
}

var books = [
    { title: "C", pages: 100 },
    { title: "A", pages: 250 },
    { title: "B", pages: 150 }
];

var sorted = getSortedArray(books, "title");

console.log(sorted);

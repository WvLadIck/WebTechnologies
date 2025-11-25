function cesar(str, shift, action) {
    var alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    var result = "";
    shift = shift % alphabet.length;

    for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        var index = -1;
        for (var j = 0; j < alphabet.length; j++) {
            if (alphabet[j] === ch) {
                index = j;
                break;
            }
        }
        if (index === -1) {
            result += ch;
            continue;
        }

        if (action === "encode") {
            var newIndex = (index + shift) % alphabet.length;
        } else { 
            var newIndex = (index - shift);
            if (newIndex < 0) newIndex += alphabet.length;
        }

        result += alphabet[newIndex];
    }

    return result;
}

console.log(cesar("эзтыхз фзъзъз", 8, "decode"));

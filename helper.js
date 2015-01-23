module.exports = {

    toBinary: function(input) {

        var result = '';

        input.split('').forEach(function(character) {

            var binary = character.charCodeAt(0).toString(2),
                padding = 8 - binary.length;

            result += new Array(padding + 1).join('0') + binary;

        });

        return result;

    },

    toAscii: function(input) {

        return input.replace(/[01]{8}/g, function(strippedInput) {
            return String.fromCharCode(parseInt(strippedInput, 2));
        });

    },

    hexToBinary: function (input) {

        var result = '';

        input.split('').forEach(function (character) {
            switch(character.toUpperCase()) {
                case '0': result += '0000'; break;
                case '1': result += '0001'; break;
                case '2': result += '0010'; break;
                case '3': result += '0011'; break;
                case '4': result += '0100'; break;
                case '5': result += '0101'; break;
                case '6': result += '0110'; break;
                case '7': result += '0111'; break;
                case '8': result += '1000'; break;
                case '9': result += '1001'; break;
                case 'A': result += '1010'; break;
                case 'B': result += '1011'; break;
                case 'C': result += '1100'; break;
                case 'D': result += '1101'; break;
                case 'E': result += '1110'; break;
                case 'F': result += '1111'; break;
                default: console.log('Hex to binary convertor error, not recognizing:', character);
            }
        });

        return result;

    },

    binaryToHex: function (input) {

        var splittedInput = [], result = '';

        // First split the input into nibbles of 4 bits
        for (var i = 0; i < (input.length / 4); i++) splittedInput[i] = input.substring((i * 4), ((i + 1) * 4));

        splittedInput.forEach(function (binary) {
            switch(binary) {
                case '0000': result += '0'; break;
                case '0001': result += '1'; break;
                case '0010': result += '2'; break;
                case '0011': result += '3'; break;
                case '0100': result += '4'; break;
                case '0101': result += '5'; break;
                case '0110': result += '6'; break;
                case '0111': result += '7'; break;
                case '1000': result += '8'; break;
                case '1001': result += '9'; break;
                case '1010': result += 'A'; break;
                case '1011': result += 'B'; break;
                case '1100': result += 'C'; break;
                case '1101': result += 'D'; break;
                case '1110': result += 'E'; break;
                case '1111': result += 'F'; break;
                default: console.log('Binary to hex convertor error, not recognizing:', binary);
            }
        });

        return result;

    },

    permutator: function (input, size, table) {

        var result = '';
        for (var i = 0; i < size; i++) result += input[table[i] - 1]; // Minus one for array counting
        return result;

    }

};
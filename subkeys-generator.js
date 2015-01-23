module.exports = function (cryption, key) {

    var helper = require('./helper'),
        permutations = require('./permutation-tables').keys;

    //
    // Make sure the key is at least 64 bits long
    var bitKey = helper.toBinary(key);
    while (bitKey.length < 64) bitKey += '0';

    //
    // First permutation, making the key 56 bits long
    var hexKey = new Buffer(helper.toAscii(bitKey), 'utf8').toString('hex'),
        permutedKey = helper.permutator(helper.hexToBinary(hexKey), 56, permutations.PC1);

    //
    // Left shifts
    function bitShift (input, positions) {
        return (input + input.substring(0, positions)).substr(positions, input.length);
    }

    var subKeys = [{
        left: permutedKey.substring(0, 28),
        right: permutedKey.substring(28, 56)
    }];

    for (var j = 1; j < 17; j++) {

        var leftShifts = permutations.leftShifts[j - 1];

        subKeys[j] = {
            left: bitShift(subKeys[j - 1].left, leftShifts),
            right: bitShift(subKeys[j - 1].right, leftShifts)
        };

    }

    //
    // Final assembly of the 16 subkeys, 48 bits each
    subKeys.shift();
    subKeys.forEach(function (keyComponents, index) {
        subKeys[index] = helper.permutator((keyComponents.left + keyComponents.right), 48, permutations.PC2);
    });

    //
    // Reverse the order for decryption
    return (cryption === 'encrypt' ? subKeys : subKeys.reverse());

};
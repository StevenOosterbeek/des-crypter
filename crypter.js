// DES Crypter, ECB mode and HEX only
// Copyright (c) 2015 Steven Oosterbeek

module.exports = function (cryption, input, key) {

    var helper = require('./helper'),
        permutations = require('./permutation-tables').cryption,
        subKeys = require('./subkeys-generator')(cryption, key),
        blocks = [], cipherText = '';

    // Encoding fix
    input = (cryption === 'encrypt' ? new Buffer(input, 'utf8').toString('hex') : input);

    //
    // Divide into blocks of 64 bits
    var binaryText = helper.hexToBinary(input);
    for (var b = 0; b < Math.ceil(binaryText.length / 64); b++) {
        blocks[b] = binaryText.substring((b * 64), ((b + 1) * 64));
        while (blocks[b].length < 64) blocks[b] += '0'; // Each block should be at least 64 bits
    }

    //
    // Manipulation per block
    for (var blockNumber = 0; blockNumber < blocks.length; blockNumber++) {

        // Initial Permutation
        var permutatedBlock = helper.permutator(blocks[blockNumber], 64, permutations.initialPermutation);

        // Dividing into Left and Right zero
        var parts = [{
                left: permutatedBlock.substring(0, 32),
                right: permutatedBlock.substring(32, 64)
            }];

        // Sixteen cipher rounds
        for (var round = 1; round < 17; round++) {

            parts[round] = {
                left: parts[(round - 1)].right,
                right: ''
            };

            var rightCipher = cipher(parts[(round - 1)].right, subKeys[round - 1]);
            for (var rx = 0; rx < 32; rx++) {
                parts[round].right += parts[(round - 1)].left[rx] ^ rightCipher[rx];
            }

        }

        // Inverse Permutation
        cipherText += helper.permutator((parts[16].right + parts[16].left), 64, permutations.inversePermutation);

    }

    //
    // Cipher function
    function cipher (rightInput, subKey) {

        var xored = '', sBoxResults = '';

        // Bit selection E
        var permuted = helper.permutator(rightInput, 48, permutations.bitSelectionE);

        // XOR Subkey
        for (var xor = 0; xor < 48; xor++) xored += subKey[xor] ^ permuted[xor];

        // S-Boxes
        for (var sb = 0; sb < 8; sb++) sBoxResults += sBox(sb, (xored.substring(sb * 6, ((sb + 1) * 6))));

        // Final cipher permutation
        return helper.permutator(sBoxResults, 32, permutations.finalCipherPermutation);

    }

    //
    // Sbox functionality
    function sBox (boxNumber, input) {

        var vertical = parseInt((input.substring(0, 1) + input.substring(5, 6)), 2),
            horizontal = parseInt(input.substring(1, 5), 2),
            output = new Buffer(permutations.sBoxes[boxNumber][vertical][horizontal].toString(2)).toString('hex');

        return helper.hexToBinary(output);

    }

    //
    // Return encryption as hex, decryption as utf8
    return (cryption === 'encrypt' ? helper.binaryToHex(cipherText) : new Buffer(helper.binaryToHex(cipherText), 'hex').toString('utf8'));

};
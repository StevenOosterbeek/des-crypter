var crypter = require('./crypter'),
    cryption = process.argv[2],
    input = process.argv[3],
    key = process.argv[4];

if (cryption && input && key && (cryption === 'encrypt' || cryption === 'decrypt')) {
    console.log('\n' + (cryption === 'encrypt' ? 'Cipher (HEX): ' : 'Original message: ') + crypter(cryption, input, key) + '\n');
} else {
    console.log('\nUsage: (node) des <encrypt/decrypt> "<input>" <key>\n');
}
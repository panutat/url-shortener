// Utility for encoding/decoding database row id and shortened URL alphanumberic string
const shrtr = (() => {
    const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    const base = alphabet.length;

    return {
        // Encode database row id to shortened URL
        encode(num) {
            let num2 = num;
            let encoded = '';
            while (num2) {
                const remainder = num2 % base;
                num2 = Math.floor(num2 / base);
                encoded = alphabet[remainder].toString() + encoded;
            }
            return encoded;
        },

        // Decode shortened URL to database row id
        decode(str) {
            let str2 = str;
            let decoded = 0;
            while (str2) {
                const index = alphabet.indexOf(str2[0]);
                const power = str2.length - 1;
                decoded += index * (Math.pow(base, power));
                str2 = str2.substring(1);
            }
            return decoded;
        },
    };
})();

export default shrtr;

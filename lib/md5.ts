function md5(input: string): string {
    const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n));
    const toHexString = (n: number) => n.toString(16).padStart(8, '0');

    const initialHashValues = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
    const k = [0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
        0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
        0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
        0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391];

    const addUnsigned = (x: number, y: number) => (x + y) >>> 0;
    const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
    const G = (x: number, y: number, z: number) => (x & z) | (y & ~z);
    const H = (x: number, y: number, z: number) => x ^ y ^ z;
    const I = (x: number, y: number, z: number) => y ^ (x | ~z);

    const preprocess = (input: string) => {
        const length = input.length * 8;
        const blocks: number[] = [];
        for (let i = 0; i < input.length; i += 64) {
            let a = initialHashValues[0];
            let b = initialHashValues[1];
            let c = initialHashValues[2];
            let d = initialHashValues[3];

            const chunk = input.substr(i, 64);

            for (let j = 0; j < 64; j += 4) {
                const word =
                    (chunk.charCodeAt(j) & 0xff) |
                    ((chunk.charCodeAt(j + 1) & 0xff) << 8) |
                    ((chunk.charCodeAt(j + 2) & 0xff) << 16) |
                    ((chunk.charCodeAt(j + 3) & 0xff) << 24);

                const temp = d;
                d = c;
                c = b;
                b = b + rotateLeft((a + F(b, c, d) + word + k[j / 4]), 7);
                a = temp;
            }

            initialHashValues[0] = addUnsigned(initialHashValues[0], a);
            initialHashValues[1] = addUnsigned(initialHashValues[1], b);
            initialHashValues[2] = addUnsigned(initialHashValues[2], c);
            initialHashValues[3] = addUnsigned(initialHashValues[3], d);
        }

        return length;
    };

    let length = preprocess(input);
    const output = new Array(4);
    for (let i = 0; i < 4; i++) {
        output[i] = initialHashValues[i];
    }

    const bytePosition = length % 64;
    const bitPosition = bytePosition * 8;

    const appendBit = 0x80;
    const zeroBits = 0x00;


    input += String.fromCharCode(appendBit);
    while (input.length % 64 !== 56) {
        input += String.fromCharCode(zeroBits);
    }

    input += String.fromCharCode(bitPosition & 0xff);
    input += String.fromCharCode((bitPosition >>> 8) & 0xff);
    input += String.fromCharCode((bitPosition >>> 16) & 0xff);
    input += String.fromCharCode((bitPosition >>> 24) & 0xff);

    length += input.length * 8;
    preprocess(input);

    for (let i = 0; i < 4; i++) {
        output[i] = addUnsigned(output[i], initialHashValues[i]);
    }

    return toHexString(output[0]) + toHexString(output[1]) + toHexString(output[2]) + toHexString(output[3]);
}

export default md5;

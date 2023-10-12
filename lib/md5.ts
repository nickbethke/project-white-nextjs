import crypto from 'crypto-js';

function md5(input: string): string {
    return crypto.MD5(input).toString();
}

export default md5;

const jwt = require('jsonwebtoken');
const Token = require('./token_interface');
require('dotenv').config();

class JWTToken extends Token {
    constructor(payload, secretKey, options) {
        super();
        this.payload = payload;
        this.secretKey = secretKey || process.env.JWT_SECRET;
        this.options = options || { expiresIn: '1h' };
    }

    generate() {
        return jwt.sign(this.payload, this.secretKey, this.options);
    }

    validate(token) {
        try {
            jwt.verify(token, this.secretKey);
            console.log("Token is valid");
        } catch (error) {
            console.log("Invalid token");
            throw new Error('Invalid token');
        }
    }

    static decode_token(token) {
        return jwt.decode(token);
    }
}

module.exports = JWTToken;
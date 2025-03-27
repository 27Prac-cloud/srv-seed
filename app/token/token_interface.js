class TokenInterface {

    generate() {
        throw new Error('Method not implemented');
    }

    validate(token) {
        throw new Error('Method not implemented');
    }
}

module.exports = TokenInterface;
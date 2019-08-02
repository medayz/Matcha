const paths = require("../config/paths");
const jwt = require("jsonwebtoken");
const fs = require("file-system");
const path = require("path");

const privateKey = fs.readFileSync(path.join(paths.RSA_KEYS, 'private.key'));
const publicKey = fs.readFileSync(path.join(paths.RSA_KEYS, 'public.key'));

module.exports = {
    getToken: userData => {
        return jwt.sign(userData, privateKey, {
            algorithm: "RS256",
            expiresIn: 3600
        });
    },
    checkToken: async token => {
        return await jwt.verify(token, publicKey, {
            algorithms: ["RS256"]
        });
    }
};
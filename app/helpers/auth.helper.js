const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT = process.env.SALT || 10;

function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

function checkPassword(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function createToken(user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, process.env.JWT_SIGNATURE_KEY || 'kodokbangkong', { expiresIn: '1h' }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    encryptPassword,
    checkPassword,
    createToken
};
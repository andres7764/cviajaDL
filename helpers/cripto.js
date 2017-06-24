var crypto = require('crypto');

var ALGORITHM = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
var HMAC_ALGORITHM = 'SHA256';
var KEY = crypto.randomBytes(32); // This key should be stored in an environment variable
var HMAC_KEY = crypto.randomBytes(32); // This key should be stored in an environment variable

module.exports = {
    generateSalt: function () {
        
        return crypto.randomBytes(128).toString('base64');
    },
    generateHashedPassword: function (salt, pwd) {
        //var hmac = crypto.createHmac('sha1', salt);
        //return hmac.update(pwd).digest('hex');
        console.log(salt,pwd);
    	cipher = crypto.createCipher('aes-256-cbc', salt);
    	cipher.update(pwd, 'utf8', 'base64');

    	return cipher.final('base64');
    },
    generateDecipherPassword: function (salt,pwd) {
        decipher = crypto.createDecipher('aes-256-cbc', salt);
        decipher.update(pwd, 'base64', 'utf8');
		
		return decipher.final('utf8');
    }
};
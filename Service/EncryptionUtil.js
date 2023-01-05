const crypto = require('crypto');
const utf8 = require('utf8');
const Constant = require('../helpers/constants')

const key = utf8.encode(Constant.CRYPT_KET).slice(0, 16);
class Encryption {
    static letsEncryptData = (jsonObj )  => {
        const iv  = Buffer.from(crypto.randomBytes(16));
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        const chunks = [];
        chunks.push(cipher.update(Buffer.from(JSON.stringify(jsonObj), 'utf8'), undefined, 'hex'));
        chunks.push(cipher.final('hex'));
        const hexPayload = chunks.join('');
        const ivHexString = iv.toString('hex');
        const hexStringToDigest = hexPayload.toString() + ivHexString;
        const hexDigest = crypto.createHash('sha256').update(hexStringToDigest).digest('hex');
        return {
          payload: hexPayload,
          iv: ivHexString,
          digest: hexDigest,
        };
      };


      static letsDecryptUrlQueryParams = (payload , iv , digest ) => {
        try {
          let decrypted ;
          const stringToDigest = payload.toString() + iv.toString();
          const verifyDigest = crypto.createHash('sha256').update(stringToDigest).digest('hex');
          const buf = Buffer.from(iv, 'hex');
          if (verifyDigest.toString() === digest) {
            const decipher = crypto.createDecipheriv('aes-128-cbc', key, buf);
            decrypted = decipher.update(payload, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return JSON.parse(decrypted);
          }
          logger.error('Invalid digest found in the url');
          throw new Error('Invalid digest found in the url');
        } catch (error) {
          logger.error(error.stack);
          throw new Error('Error in Decrypting the details');
        }
      };
    
}

module.exports =Encryption;
const crypto = require("crypto");
const qs = require("qs");

const sortObject = (obj) => {
  const sorted = {};

  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = obj[key];
  }

  return sorted;
};

const createSecureHash = (params) => {
  const sortedParams = sortObject(params);

  const signData = qs.stringify(sortedParams, {
    encode: false,
  });

  return crypto
    .createHmac("sha512", process.env.VNPAY_HASH_SECRET)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");
};

const verifySecureHash = (params, receivedHash) => {
  if (!receivedHash) {
    return false;
  }

  const calculatedHash = createSecureHash(params);

  const receivedBuffer = Buffer.from(receivedHash, "utf8");

  const calculatedBuffer = Buffer.from(calculatedHash, "utf8");

  if (receivedBuffer.length !== calculatedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(receivedBuffer, calculatedBuffer);
};

module.exports = {
  sortObject,
  createSecureHash,
  verifySecureHash,
};

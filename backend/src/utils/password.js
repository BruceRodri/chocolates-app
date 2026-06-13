const crypto = require("crypto");

const DEFAULT_ITERATIONS = 120000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(password, salt, DEFAULT_ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return `pbkdf2_sha256$${DEFAULT_ITERATIONS}$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash) return false;

  const [algorithm, iterations, salt, hash] = storedHash.split("$");
  if (algorithm !== "pbkdf2_sha256" || !iterations || !salt || !hash) {
    return false;
  }

  const candidate = crypto
    .pbkdf2Sync(password, salt, Number(iterations), KEY_LENGTH, DIGEST)
    .toString("hex");

  if (candidate.length !== hash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

module.exports = {
  hashPassword,
  verifyPassword,
};

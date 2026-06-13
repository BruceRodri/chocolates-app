const crypto = require("crypto");

const TOKEN_TTL_SECONDS = 60 * 60 * 8;

function base64url(input) {
  return Buffer.from(JSON.stringify(input)).toString("base64url");
}

function sign(value) {
  const secret = process.env.AUTH_SECRET || "dev-auth-secret";
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function createToken(user) {
  const header = base64url({ alg: "HS256", typ: "JWT" });
  const payload = base64url({
    sub: user.id_usuario,
    username: user.username,
    rol: user.rol,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  });
  const signature = sign(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  const [header, payload, signature] = String(token || "").split(".");
  if (!header || !payload || !signature) return null;

  const expected = sign(`${header}.${payload}`);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;

  return data;
}

module.exports = {
  createToken,
  verifyToken,
};

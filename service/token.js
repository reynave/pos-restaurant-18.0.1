const jwt = require('jsonwebtoken');
const myPassword =  'gXXjLL9M9P1lyTg49nJ32GvwMT09rl30IgJWoo712T4IL8CREV';

function generateToken(payload, password) {
  const token = jwt.sign(payload, password, { expiresIn: '1h' });
  return token;
}

// Contoh pakai
const client = 'MITRALINK';
const payload = {
  terminalId : '0005',
  expired: '2027-01-01'
};

const matchPass = client+myPassword;

const token = generateToken(payload, matchPass);
console.log('Generated JWT:', token);
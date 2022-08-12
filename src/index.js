const express = require('express');
var jwt = require('jsonwebtoken');

const TOKEN_SECRET = 'KKKKKKKK';
const USER_NAME = '***';
const PASSWORD = '********';

const server = express();
server.use(express.json());

function validate(error, property, propertyName) {
  if (!property) {
    error.push(`A propriedade ${propertyName} deve ser enviada.`);
  }
}

function validateProperties(req) {
  let error = [];
  validate(error, req.body.interfaceId, 'interfaceId');
  validate(error, req.body.year, 'year');
  validate(error, req.body.month, 'month');
  validate(error, req.body.day, 'day');
  validate(error, req.body.sequenceId, 'sequenceId');

  if (error.length > 0) {
    throw error.join('\r\n');
  }
}

function verifyJWT(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token)
    return res.status(403).send('A token is required for authentication');

  jwt.verify(token, TOKEN_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

server.post('/api/integration/source-table-name', verifyJWT, (req, res) => {
  validateProperties(req);

  let interfaceId = String(req.body.interfaceId).padStart(4, '0');
  let month = String(req.body.month).padStart(2, '0');
  let day = String(req.body.day).padStart(2, '0');
  let sequenceId = String(req.body.sequenceId).padStart(2, '0');
  let ret = `AGC_${interfaceId}_${req.body.year}${month}${day}${sequenceId}`;
  return res.json(ret);
});

server.post('/api/integration/submit-interface', verifyJWT, (req, res) => {
  validateProperties(req);

  return res.json();
});

server.post('/api/auth', (req, res) => {
  if (req.body.username != USER_NAME || req.body.password != PASSWORD) {
    return res.status(400).send('Invalid Credentials');
  }

  var token = jwt.sign({ user: req.body.username }, TOKEN_SECRET);

  var ret = { token };

  return res.json(ret);
});

server.listen(3004);

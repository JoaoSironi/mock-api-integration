const express = require('express');

const server = express();
server.use(express.json());

server.get('/file-name', (req, res) => {
  let ret = [
    {
      file_name: 'AGC_0210_2022071901',
    },
  ];
  return res.json(ret);
});


server.post('/submit-interface', (req, res) => {
  return res.json();
});

server.listen(3004);

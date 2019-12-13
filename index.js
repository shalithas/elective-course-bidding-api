const express = require('express');

const app = express();

require('./startup/logging')();
require('./startup/db')();
require('./startup/validation')();
require('./startup/routes')(app);


app.listen(3000, () => {
    console.log(`Server started on port`);
});
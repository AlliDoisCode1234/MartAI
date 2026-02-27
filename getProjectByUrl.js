const https = require('https');
// Nah, I can just use a local node script because there's no way to easily query standard Convex table from CLI 
// wait, I can write a query in a local file and then execute it against `--prod`, BUT IT FAILS because the function name is not exported in the prod deployment!

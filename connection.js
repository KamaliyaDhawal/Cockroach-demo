const parse = require("pg-connection-string").parse;
const { Pool } = require("pg");
require("dotenv").config();

let client;

function connect() {
    const config = parse(process.env.CONNECTION_STRING);
    const pool = new Pool(config);
    client = pool.connect();
    return client;
}

module.exports.dbConnection = async () => {
    if (!client) {
        return await connect();
    } else {
        return client;
    }
}

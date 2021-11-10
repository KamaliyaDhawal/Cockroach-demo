const express = require("express");
const app = express();
const db = require("./connection");
const { v4: uuidv4 } = require("uuid");

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json())

app.use(async (req, res, next) => {
    req.dbClient = await db.dbConnection();
    next();
})

app.get("/accounts", async (req, res) => {
    const query = "select * from accounts";
    const result = await req.dbClient.query(query);
    res.send(result.rows);
});

app.post("/account", async (req, res) => {
    const balance = req.body.balance;
    const query = `insert into accounts (id, balance) Values($1, $2)`;
    const uid = await uuidv4();
    const result = await req.dbClient.query(query, [uid, balance]);
    res.send(result.rowCount === 1 ? "Data Insert Successfully" : "Error While Insert Data");
});

app.post("/account/:id", async (req, res) => {
    const balance = req.body.balance;
    const id = req.params.id;
    const query = `update accounts set balance = $1 where id = $2`;
    const result = await req.dbClient.query(query, [balance, id]);
    res.send(result.rowCount === 1 ? "Data Update Successfully" : "Error While Update Data");
});

app.delete("/account/:id", async (req, res) => {
    const id = req.params.id;
    const query = `delete from accounts where id = $1`;
    const result = await req.dbClient.query(query, [id]);
    res.send(result.rowCount === 1 ? "Data Deleted Successfully" : "Error While Deleted Data");
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
    console.log(`Server is ready on port: ${port}`);
});
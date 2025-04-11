const express = require('express')
const sqlite3 = require('sqlite3').verbose();

const app = express()
const port = 3000

const runFromDB = (sql_request) => {
    const db = new sqlite3.Database('db.sqlite');
    const result = db.serialize(() => {
        return db.run(sql_request);
    });    
    db.close() 
    return result
}

// Initialisation de la base de données
runFromDB("CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY ASC, title TEXT, completed TINYINT)");


app.get('/', (req, res) => {
    const tasks = runFromDB("SELECT * FROM Task")
    res.send(tasks)
})

app.listen(port, () => {
    console.log("✅ Server launched....")
})
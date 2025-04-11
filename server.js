const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')

const app = express()
const port = 3000
app.use(bodyParser.json())

const runFromDB = (sql_request) => {
    const db = new sqlite3.Database('db.sqlite');
    const result = db.serialize(() => {
        return db.run(sql_request);
    });    
    db.close() 
    return result
}

const allFromDB = async (sql_request) => {
    
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('db.sqlite');
        db.all(sql_request, [], (err, rows) => {
            if(err){
                reject(err)
            } else {
                resolve(rows)
            }
        })
        db.close() 
    })
}

// Initialisation de la base de données
runFromDB("CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY ASC, title TEXT, completed TINYINT)");


app.get('/tasks', async  (req, res) => {
    const tasks = await allFromDB("SELECT * FROM Task")
    res.send(tasks)
})

app.post('/tasks', (req, res) => {
    const body = req.body
    console.log(body)
    runFromDB(`INSERT INTO Task (title, completed) VALUES ("${body.title}", "0")`)
    res.status(200).send("Task created")
})

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params
    const tasks = await allFromDB(`SELECT * FROM Task WHERE id = ${id}`)
    const task = tasks[0]
    await runFromDB(`UPDATE Task SET completed = ${task?.completed ? 0 : 1} WHERE id = ${task?.id}`)
    res.status(200).send(`Tâche modifiée (${task?.completed ? "Pas finie 👎" : "Finie 👍"})`)
})

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params
    runFromDB(`DELETE FROM Task WHERE id = ${id}`)
    res.send("Tâche supprimée 😭")
})

app.listen(port, () => {
    console.log("✅ Server launched....")
})
const express = require('express')
const app = express()
const port = 3000


app.get('/', (req, res) => {
    res.send("Je suis recrutable maintenant !")
})

app.listen(port, () => {
    console.log("✅ Server launched....")
})
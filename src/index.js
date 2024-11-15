require('dotenv').config()
const express = require('express')
const cors = require('cors')


let PORT = process.env.PORT || 8080
let hamza

const app = express()

app.use(cors())
app.use(express.json())


app.listen(PORT, () => {
    console.warn(`server is running at http://localhost:${PORT}`)
})
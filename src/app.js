const express = require('express')
const userRoutes = require('./routes/userRoutes')
const journalRoutes = require('./routes/journalRoutes')

const app = express();

app.use(express.json())
app.use(express.urlencoded( { extended: true }))

app.use('/api', userRoutes)
app.use('/api', journalRoutes)

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${ port }`)
})
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const authRoutes = require('./routes/auth')
const plansRoutes = require('./routes/plans')
const subsRoutes = require('./routes/subscriptions')

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/plans', plansRoutes)
app.use('/api', subsRoutes)

app.get('/', (req, res) => res.send({ ok: true }))

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server running on port ${port}`))

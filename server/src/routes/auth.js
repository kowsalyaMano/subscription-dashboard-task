const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { z } = require('zod')

const registerSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) })
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })

function signAccess(user) {
  return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' })
}

function signRefresh(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' })
}

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return res.status(409).json({ error: 'Email already in use' })
    const hashed = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({ data: { name: data.name, email: data.email, password: hashed } })
    const access = signAccess(user)
    const refresh = signRefresh(user)
    
    const decoded = jwt.decode(refresh)
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000)
    await prisma.refreshToken.create({ data: { token: refresh, userId: user.id, expiresAt } })
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, access, refresh })
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(data.password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const access = signAccess(user)
    const refresh = signRefresh(user)
    const decoded = jwt.decode(refresh)
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000)
    await prisma.refreshToken.create({ data: { token: refresh, userId: user.id, expiresAt } })
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, access, refresh })
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/exists', async (req, res) => {
  try {
    const email = req.query.email
    if (!email) return res.status(400).json({ error: 'email required' })
    const user = await prisma.user.findUnique({ where: { email } })
    res.json({ exists: !!user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router


router.post('/refresh', async (req, res) => {
  try {
    const { refresh } = req.body
    if (!refresh) return res.status(400).json({ error: 'Refresh token required' })

    let payload
    try { payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET) } catch (e) { return res.status(401).json({ error: 'Invalid refresh token' }) }
  
    const stored = await prisma.refreshToken.findUnique({ where: { token: refresh }, include: { user: true } })
    if (!stored) return res.status(401).json({ error: 'Refresh token not found' })
  
    await prisma.refreshToken.delete({ where: { id: stored.id } })
    const user = stored.user
    const access = signAccess(user)
    const newRefresh = signRefresh(user)
    const decoded = jwt.decode(newRefresh)
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000)
    await prisma.refreshToken.create({ data: { token: newRefresh, userId: user.id, expiresAt } })
    res.json({ access, refresh: newRefresh })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})


router.post('/logout', async (req, res) => {
  try {
    const { refresh } = req.body
    if (!refresh) return res.status(400).json({ error: 'Refresh token required' })
    await prisma.refreshToken.deleteMany({ where: { token: refresh } })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Unauthorized User! Login to Subscribe the plan!!' })
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  next()
}

router.post('/subscribe/:planId', authMiddleware, async (req, res) => {
  try {
    const planId = parseInt(req.params.planId)
    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) return res.status(404).json({ error: 'Plan not found' })
    const userId = req.user.userId
    const now = new Date()
    const existing = await prisma.subscription.findFirst({ where: { userId, AND: [{ endDate: { gt: now } }, { status: 'active' }] }, orderBy: { startDate: 'desc' } })
    if (existing) {
      if (existing.planId === planId) return res.status(400).json({ error: 'Already subscribed to this plan' })
      await prisma.subscription.update({ where: { id: existing.id }, data: { status: 'cancelled', endDate: now } })
    }

    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000)
    const sub = await prisma.subscription.create({ data: { userId, planId, startDate, endDate, status: 'active' } })
    res.json(sub)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/my-subscription', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    const sub = await prisma.subscription.findFirst({ where: { userId }, include: { plan: true } , orderBy: { startDate: 'desc' } })
    if (!sub) return res.json({ subscription: null })
    const now = new Date()
    const status = (new Date(sub.endDate) > now) ? 'active' : 'expired'
    res.json({ subscription: { ...sub, status, plan: { ...sub.plan, features: sub.plan.features } } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/admin/subscriptions', authMiddleware, adminOnly, async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany({ include: { user: true, plan: true }, orderBy: { startDate: 'desc' } })
    res.json(subs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router

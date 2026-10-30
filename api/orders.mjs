import { pool } from '../lib/db.mjs'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })
    const order = req.body || {}
    if (!order.folio || !order.cliente) return res.status(400).json({ error: 'Pedido incompleto' })
    const total = Number.parseFloat(order.total) || 0
    const scheduledAt = order.fechaProgramada ? new Date(order.fechaProgramada) : null
    if (scheduledAt && Number.isNaN(scheduledAt.getTime())) return res.status(400).json({ error: 'Fecha programada inválida' })
    const customer = await pool.query('INSERT INTO app_customers (name, phone, address, notes) VALUES ($1,$2,$3,$4) RETURNING id', [String(order.cliente).slice(0,120), order.pagos?.wa || null, order.dir || null, order.terminos || null])
    const result = await pool.query('INSERT INTO app_orders (customer_id, folio, payload, total, scheduled_at) VALUES ($1,$2,$3::jsonb,$4,$5) RETURNING id, folio, created_at', [customer.rows[0].id, order.folio, JSON.stringify(order), total, scheduledAt])
    return res.status(201).json(result.rows[0])
  } catch (error) { return res.status(500).json({ error: 'No se pudo guardar el pedido' }) }
}

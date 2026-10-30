import { pool } from '../lib/db.mjs'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT id, name, phone, email, address, notes, created_at FROM app_customers ORDER BY created_at DESC LIMIT 500')
      return res.status(200).json(rows)
    }
    if (req.method === 'POST') {
      const { name, phone, email, address, notes } = req.body || {}
      if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Nombre requerido' })
      const { rows } = await pool.query('INSERT INTO app_customers (name, phone, email, address, notes) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, phone, email, address, notes, created_at', [name.trim().slice(0,120), phone || null, email || null, address || null, notes || null])
      return res.status(201).json(rows[0])
    }
    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) { return res.status(500).json({ error: 'No se pudo consultar clientes' }) }
}

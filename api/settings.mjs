import { pool } from '../lib/db.mjs'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT key, value FROM app_settings')
      return res.status(200).json(Object.fromEntries(rows.map((row) => [row.key, row.value])))
    }
    if (req.method === 'PUT') {
      const entries = Object.entries(req.body || {})
      for (const [key, value] of entries) await pool.query('INSERT INTO app_settings (key, value, updated_at) VALUES ($1,$2::jsonb,now()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()', [key, JSON.stringify(value)])
      return res.status(200).json({ ok: true })
    }
    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) { return res.status(500).json({ error: 'No se pudo guardar configuración' }) }
}

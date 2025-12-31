import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export default async function handler(req: any, res: any) {
  const { categoria } = req.query

  try {
    const result = await pool.query(
      'SELECT texto FROM frases WHERE categoria = $1 ORDER BY RANDOM() LIMIT 1',
      [categoria]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No hay frases' })
    }

    res.status(200).json({
      message: result.rows[0].texto,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error del duende' })
  }
}

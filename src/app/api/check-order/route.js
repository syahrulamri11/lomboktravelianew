import pool from '@/utils/dbConfig';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { user, tour } = req.query;

    if (!user || !tour) {
      return res.status(400).json({ error: 'Missing user or tour parameter' });
    }

    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM orders
        WHERE id_user = $1 AND id_tour = $2
      `;
      const result = await client.query(query, [user, tour]);
      client.release();

      if (result.rows.length > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(200).json({ success: false });
      }
    } catch (error) {
      console.error('Error checking order:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

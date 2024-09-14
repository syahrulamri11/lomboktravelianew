import pool from '@/utils/dbConfig';

// Handler untuk POST request
export async function POST(req) {
  try {
    const { id_tour, id_order, rating, deskripsi } = await req.json();

    console.log('Received data:', { id_tour, id_order, rating, deskripsi });

    if (!id_tour || !id_order || !rating || !deskripsi) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id_review = 'rev' + Date.now();

    const client = await pool.connect();
    const query = `
      INSERT INTO review (id_review, id_tour, id_order, rating, deskripsi, _created_date)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const result = await client.query(query, [id_review, id_tour, id_order, rating, deskripsi]);
    client.release();

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error inserting review:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// Handler untuk GET request
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_tour = searchParams.get('id_tour');

    let query;
    let params = [];

    if (id_tour) {
      // Query untuk mendapatkan review berdasarkan id_tour
      query = `
        SELECT r.*, o.id_user, u.nama 
        FROM review r 
        LEFT JOIN orders o ON r.id_order = o.id_orders 
        LEFT JOIN public."user" u ON o.id_user = u.id_user
        WHERE r.id_tour = $1
        ORDER BY _created_date DESC
      `;
      params = [id_tour];
    } else {
      // Query untuk mendapatkan semua review
      query = `
        SELECT r.*, o.id_user, u.nama 
        FROM review r 
        LEFT JOIN orders o ON r.id_order = o.id_orders 
        LEFT JOIN public."user" u ON o.id_user = u.id_user
        ORDER BY _created_date DESC
      `;
    }

    const result = await pool.query(query, params);

    return new Response(JSON.stringify({ reviews: result.rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
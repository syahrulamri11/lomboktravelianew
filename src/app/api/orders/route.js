// import pool from '@/utils/dbConfig';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const client = await pool.connect();
//       const result = await client.query(`
//         SELECT o.id_orders, o.tanggal_pesan, o.status, o.amount, o.payment_type, u.email
//         FROM orders o
//         JOIN user u ON o.id_user = u.id_user
//       `);
//       client.release();
//       res.status(200).json({ orders: result.rows });
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else if (req.method === 'DELETE') {
//     const { id } = req.query;
//     try {
//       const client = await pool.connect();
//       const deleteQuery = `
//         DELETE FROM orders
//         WHERE id_orders = $1
//       `;
//       await client.query(deleteQuery, [id]);
//       client.release();
//       res.status(200).json({ message: 'Order deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'DELETE']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// import pool from '@/utils/dbConfig';
// import { NextResponse } from 'next/server';

// // Fungsi untuk menangani GET request
// export async function GET() {
//   let client;
//   try {
//     client = await pool.connect();
//     const result = await client.query(`
//       SELECT o.id_orders, o._created_date, o.status, o.amount, u.email
//       FROM orders o
//       JOIN "user" u ON o.id_user = u.id_user
//     `);
//     return NextResponse.json({ orders: result.rows });
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   } finally {
//     // Ensure the client is released even if there's an error
//     if (client) client.release();
//   }
// }

// // Fungsi untuk menangani DELETE request
// export async function DELETE(request) {
//   let client;
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get('id');

//   if (!id) {
//     return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
//   }

//   try {
//     const client = await pool.connect();
//     const deleteQuery = `
//       DELETE FROM orders
//       WHERE id_orders = $1
//     `;
//     const result = await client.query(deleteQuery, [id]);

//     if (result.rowCount === 0) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Order deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting order:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   } finally {
//     if (client) client.release();
//   }
// }

import pool from '@/utils/dbConfig';
import { NextResponse } from 'next/server';

// Fungsi untuk menangani GET request
export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    // Mengambil data pesanan
    const ordersResult = await client.query(`
      SELECT o.id_orders, o._created_date, o.status, o.amount, u.email
      FROM orders o
      JOIN "user" u ON o.id_user = u.id_user
    `);

    // Mengambil 3 paket tour yang paling sering diorder
    const popularPackagesResult = await client.query(`
     SELECT pt.nama_paket, COUNT(*) AS order_count
      FROM orders o
      JOIN paket_tour pt ON o.id_tour = pt.id_tour
      GROUP BY pt.nama_paket
      ORDER BY order_count DESC
      LIMIT 3
    `);

    // Mengambil jumlah transaksi 6 bulan terakhir
    const transactionsLastSixMonthsResult = await client.query(`
      SELECT TO_CHAR(_created_date, 'Month YYYY') AS month, COUNT(*) AS transaction_count
      FROM orders
      WHERE _created_date >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(_created_date, 'Month YYYY')
      ORDER BY MIN(_created_date) -- Menyortir berdasarkan tanggal awal
    `);

    return NextResponse.json({ 
      orders: ordersResult.rows,
      popularPackages: popularPackagesResult.rows,
      transactionsLastSixMonths: transactionsLastSixMonthsResult.rows
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

// Fungsi untuk menangani DELETE request
export async function DELETE(request) {
  let client;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    client = await pool.connect();
    const deleteQuery = `
      DELETE FROM orders
      WHERE id_orders = $1
    `;
    const result = await client.query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}


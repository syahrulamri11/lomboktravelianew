/*import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

// Inisialisasi client Midtrans
const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { order_id, transaction_status, fraud_status } = body;

    // Lakukan tindakan berdasarkan status pembayaran
    if (transaction_status === 'capture' && fraud_status === 'accept') {
      // Pembayaran berhasil
    } else if (transaction_status === 'settlement') {
      // Pembayaran berhasil
    } else if (transaction_status === 'deny' || transaction_status === 'expire' || transaction_status === 'cancel') {
      // Pembayaran gagal
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} */

  import { NextResponse } from 'next/server';
  import midtransClient from 'midtrans-client';
  import pool from '@/utils/dbConfig';
  
  // Inisialisasi client Midtrans
  const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });
  
  export async function POST(request) {
    try {
      const body = await request.json();
      const { order_id, transaction_status, fraud_status } = body;
  
      // Lakukan tindakan berdasarkan status pembayaran
      if ((transaction_status === 'capture' && fraud_status === 'accept') || transaction_status === 'settlement') {
        // Pembayaran berhasil
        await pool.query('UPDATE orders SET status = $1 WHERE id_orders = $2', ['completed', order_id]);
      } else if (transaction_status === 'deny' || transaction_status === 'expire' || transaction_status === 'cancel') {
        // Pembayaran gagal
        await pool.query('UPDATE orders SET status = $1 WHERE id_orders = $2', ['failed', order_id]);
      }
  
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Notification error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  

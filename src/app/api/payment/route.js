/* import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

// Inisialisasi client Midtrans
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  try {
    const { id_user, id_tour, total_cost } = await request.json();
    console.log('Request data:', { id_user, id_tour, total_cost });

    const transactionDetails = {
      order_id: `order-${Date.now()}`,
      gross_amount: total_cost,
    };

    const customerDetails = {
      id: id_user,
    };

    const parameter = {
      transaction_details: transactionDetails,
      customer_details: customerDetails,
    };

    console.log('Transaction parameters:', parameter);

    const transaction = await snap.createTransaction(parameter);
    console.log('Transaction created:', transaction);
    return NextResponse.json({ token: transaction.token });
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
*/

import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { v4 as uuidv4 } from 'uuid';
import pool from '@/utils/dbConfig';

// Inisialisasi client Midtrans
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  try {
    const { id_user, id_tour, email, amount } = await request.json();
    console.log('Request data:', { id_user, id_tour, email, amount });

    const orderId = uuidv4();

    // Mengonversi amount ke integer
    const parsedAmount = parseInt(amount, 10);

    // Insert order ke database
    const query = {
      text: 'INSERT INTO orders (id_orders, id_user, id_tour, email, amount, status, _created_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *',
      values: [orderId, id_user, id_tour, email, parsedAmount, 'pending'],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to add order"
      }, { status: 403 });
    }

    const transactionDetails = {
      order_id: orderId,
      gross_amount: parsedAmount,
    };

    const customerDetails = {
      id: id_user,
      email: email,
    };

    const parameter = {
      transaction_details: transactionDetails,
      customer_details: customerDetails,
    };

    console.log('Transaction parameters:', parameter);

    const transaction = await snap.createTransaction(parameter);
    console.log('Transaction created:', transaction);
    return NextResponse.json({ token: transaction.token, orderId: orderId });
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
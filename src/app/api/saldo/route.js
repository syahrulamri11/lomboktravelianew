import pool from '@/utils/dbConfig';
import { NextResponse } from 'next/server';

// Fungsi untuk menangani GET request
export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    // Mengambil total saldo dari tabel orders
    const saldoResult = await client.query(`
      SELECT SUM(amount) AS available_balance
      FROM orders
    `);
    
    // Mengambil data penarikan dari tabel orders
    const ordersResult = await client.query(`
      SELECT o.id_orders, o._created_date, o.amount, u.email
      FROM orders o
      JOIN "user" u ON o.id_user = u.id_user
    `);
    return NextResponse.json({ 
      saldo: saldoResult.rows[0] || { available_balance: 0 }, 
      orders: ordersResult.rows 
    });
  } catch (error) {
    console.error('Error fetching saldo and orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

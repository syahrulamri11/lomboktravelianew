import { NextResponse } from 'next/server';
import pool from '../../../../utils/dbConfig'; // Menggunakan path yang benar untuk dbConfig.js

// Fungsi untuk mendapatkan statistik dashboard
async function getDashboardStats() {
  try {
    const [
      totalPaketTourResult,
      totalDestinasiResult,
      totalPenggunaResult,
      totalSaldoResult,
      totalPesananResult,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM "paket_tour"'),
      pool.query('SELECT COUNT(*) FROM "destinasi"'),
      pool.query('SELECT COUNT(*) FROM "user"'),
      pool.query('SELECT SUM(amount) AS total_saldo FROM orders'),
      pool.query('SELECT COUNT(*) FROM "orders"'),
    ]);

    return {
      totalPaketTour: totalPaketTourResult.rows[0].count,
      totalDestinasi: totalDestinasiResult.rows[0].count,
      totalPengguna: totalPenggunaResult.rows[0].count,
      totalSaldo: totalSaldoResult.rows[0].total_saldo,
      totalPesanan: totalPesananResult.rows[0].count,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw new Error('Error getting dashboard stats');
  }
}

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

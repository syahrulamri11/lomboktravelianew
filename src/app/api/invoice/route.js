import pool from '@/utils/dbConfig';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  const { orderId } = await req.json();

  try {
    const { rows: orderRows } = await pool.query('SELECT * FROM orders WHERE id_orders = $1', [orderId]);

    if (orderRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }

    const order = orderRows[0];

    const { rows: paketRows } = await pool.query('SELECT * FROM paket_tour WHERE id_tour = $1', [order.id_tour]);
    const { rows: userRows } = await pool.query('SELECT * FROM "user" WHERE id_user = $1', [order.id_user]);
    const { rows: destinasiRows } = await pool.query('SELECT * FROM paket_tour_destinasi WHERE id_tour = $1', [order.id_tour]);
    // console.log('Order found:', orderRows[0]);
    // console.log('User found:', userRows[0]);
    // console.log('Dest found:', destinasiRows);
    
    const destinasiIds = destinasiRows.map(item => item.id_destinasi);
    //console.log('Dest List:', destinasiIds);

    const placeholders = destinasiIds.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT nama_destinasi, harga FROM destinasi WHERE id_destinasi IN (${placeholders})`;
    const destQuery = {
      text: queryText,
      values: destinasiIds,
    };

    const result = await pool.query(destQuery);

    if (paketRows.length === 0 || userRows.length === 0 || destinasiRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Associated data not found' }), { status: 404 });
    }

    const paket = paketRows[0];
    const user = userRows[0];

    const id_paket_invoice = uuidv4();
    const id_destinasi_invoice = uuidv4();
    const id_user_invoice = uuidv4();
    const id_invoice = uuidv4();

    await pool.query(
      `INSERT INTO paket_invoice (id_paket_invoice, nama_paket, harga, durasi, jenis_paket)
       VALUES ($1, $2, $3, $4, $5)`,
      [id_paket_invoice, paket.nama_paket, paket.harga, paket.durasi, paket.jenis_paket]
    );

    const destinasiInvoice = result.rows;

    let addedDestinationInvoice = {rows:[]};
    if(destinasiInvoice.length > 0) {
      const destinationsInvoiceValues = destinasiInvoice.map((destinasi) => [destinasi.nama_destinasi, destinasi.harga, id_paket_invoice]);
      const insertDestinasiInvoiceQuery = {
        text: `INSERT INTO destinasi_invoice (nama_destinasi, harga, id_paket_invoice) 
        VALUES ${destinationsInvoiceValues.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')}
        RETURNING nama_destinasi, harga`,
        values: destinationsInvoiceValues.flat(),
      };
      addedDestinationInvoice = await pool.query(insertDestinasiInvoiceQuery);
    }

    // console.log(addedDestinationInvoice.rows);

    const destinasi = addedDestinationInvoice.rows;

    await pool.query(
      `INSERT INTO user_invoice (id_user_invoice, nama, email)
       VALUES ($1, $2, $3)`,
      [id_user_invoice, user.nama, user.email]
    );

    const amount = order.amount; // Ganti dengan field yang sesuai dari tabel orders

    await pool.query(
      `INSERT INTO invoice (id_invoice, _created_date, amount, id_paket_invoice, id_user_invoice)
       VALUES ($1, $2, $3, $4, $5)`,
      [id_invoice, new Date(), amount, id_paket_invoice, id_user_invoice]
    );

    const invoiceHTML = `
      <h1>Invoice</h1>
      <p>Invoice ID: ${id_invoice}</p>
      <p>Nama Paket: ${paket.nama_paket}</p>
      <p>Harga Paket: ${paket.harga}</p>
      <p>Durasi: ${paket.durasi} hari</p>
      <p>Jenis Paket: ${paket.jenis_paket}</p>
      <div>
        <p>Destinasi</p>
        <ul>
          ${destinasi.map((dest, index) => `<li key={index}>${dest.nama_destinasi} - ${dest.harga}</li>`).join('')}
        </ul>
      </div>
      <p>Nama User: ${user.nama}</p>
      <p>Email User: ${user.email}</p>
      <h3>Total Harga: ${amount}</h3>
      <p>Tanggal Pembelian: ${new Date().toLocaleDateString()}</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Invoice Pembelian Paket Tour',
      html: invoiceHTML,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Invoice sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
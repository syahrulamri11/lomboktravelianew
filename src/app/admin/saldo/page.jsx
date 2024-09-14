'use client';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout';

// Fungsi untuk memformat rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
};

const SaldoPage = () => {
  const [saldo, setSaldo] = useState({});
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchSaldoAndOrders();
  }, []);

  const fetchSaldoAndOrders = async () => {
    try {
      const response = await fetch('/api/saldo');
      if (!response.ok) {
        throw new Error('Failed to fetch saldo and orders');
      }
      const data = await response.json();
      const sortedOrders = data.orders.sort((a, b) => new Date(b._created_date) - new Date(a._created_date));
      setSaldo(data.saldo);
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching saldo and orders:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentItems = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Saldo</h1>
        <div className="flex justify-between mb-8">
          <div className="p-4 border rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Saldo Tersedia</h2>
            <p className="text-xl font-bold">{formatRupiah(saldo.available_balance || 0)}</p>
          </div>
          <div className="p-4 border rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Saldo dapat ditarik</h2>
            <p className="text-xl font-bold">{formatRupiah(saldo.available_balance || 0)}</p>
            <p className="text-sm">Min. Penarikan dana 10.000</p>
            <a href="https://dashboard.sandbox.midtrans.com/" target="_blank" rel="noopener noreferrer">
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Tarik dana</button>
            </a>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Riwayat Penarikan</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Tanggal & Waktu</th>
                <th className="py-2 px-4 border-b">ID Penarikan</th>
                <th className="py-2 px-4 border-b">Email Pelanggan</th>
                <th className="py-2 px-4 border-b">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{formatDate(order._created_date)}</td>
                  <td className="py-2 px-4 border-b">{order.id_orders}</td>
                  <td className="py-2 px-4 border-b">{order.email}</td>
                  <td className="py-2 px-4 border-b">{formatRupiah(order.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SaldoPage;

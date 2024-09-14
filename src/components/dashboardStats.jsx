import React from 'react';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-blue-500 text-white rounded shadow-md">
        <h2>Total Paket Tour</h2>
        <p>{stats.totalPaketTour}</p>
      </div>
      <div className="p-4 bg-green-500 text-white rounded shadow-md">
        <h2>Total Destinasi</h2>
        <p>{stats.totalDestinasi}</p>
      </div>
      <div className="p-4 bg-yellow-500 text-white rounded shadow-md">
        <h2>Total Pengguna</h2>
        <p>{stats.totalPengguna}</p>
      </div>
      <div className="p-4 bg-red-500 text-white rounded shadow-md">
        <h2>Total Saldo</h2>
        <p>{stats.totalSaldo}</p>
      </div>
      <div className="p-4 bg-indigo-500 text-white rounded shadow-md">
        <h2>Total Pesanan</h2>
        <p>{stats.totalPesanan}</p>
      </div>
    </div>
  );
};

export default DashboardStats;

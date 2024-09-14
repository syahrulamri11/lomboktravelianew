"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import DashboardStats from '../../../components/dashboardStats';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    popularPackages: [],
    transactionsLastSixMonths: [],
    totalPaketTour: 0,
    totalDestinasi: 0,
    totalPengguna: 0,
    totalSaldo: "Rp 0",
    totalPesanan: 0,
  });

    // Fungsi untuk memformat rupiah
    const formatRupiah = (angka) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    };  

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();

      const responseOrders = await fetch('/api/orders');
      const dataOrders = await responseOrders.json();

      setStats({
        popularPackages: dataOrders.popularPackages || [],
        transactionsLastSixMonths: dataOrders.transactionsLastSixMonths || [],
        totalPaketTour: data.totalPaketTour,
        totalDestinasi: data.totalDestinasi,
        totalPengguna: data.totalPengguna,
        totalSaldo: formatRupiah(data.totalSaldo),
        totalPesanan: data.totalPesanan,
      });
    };

    fetchStats();
  }, []);

  const shortenLabel = (label) => {
    return label.length > 20 ? label.slice(0, 20) + '...' : label;
  };

  const popularPackagesData = {
    labels: stats.popularPackages.length > 0 ? stats.popularPackages.map(pkg => shortenLabel(pkg.nama_paket)) : ['No Data'],
    datasets: [
      {
        // label: 'Orders',
        data: stats.popularPackages.length > 0 ? stats.popularPackages.map(pkg => pkg.order_count) : [0],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const transactionsLastSixMonthsData = {
    labels: stats.transactionsLastSixMonths.length > 0 ? stats.transactionsLastSixMonths.map(tx => tx.month) : ['No Data'],
    datasets: [
      {
        label: 'Transactions',
        data: stats.transactionsLastSixMonths.length > 0 ? stats.transactionsLastSixMonths.map(tx => tx.transaction_count) : [0],
        backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        // position: 'top',
        display: false, // Menyembunyikan legenda sepenuhnya
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const { dataIndex } = tooltipItem;
            const fullLabel = stats.popularPackages[dataIndex]?.nama_paket || 'No Data';
            const orderCount = tooltipItem.raw;
            return `${fullLabel}: ${orderCount}`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    aspectRatio: 2, // Set aspect ratio if needed
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const { label, raw } = tooltipItem;
            return `${label}: ${raw}`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    aspectRatio: 1, // Set aspect ratio for pie chart
  };

  return (
    <AdminLayout showSidebar={true}>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <DashboardStats stats={stats} />
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 text-blue-700 rounded shadow-md">
            <h3 className="text-lg font-semibold">Top 3 Paket Tour Best Order</h3>
            <div style={{ height: '300px' }}> {/* Set explicit height */}
              <Bar data={popularPackagesData} options={barOptions} />
            </div>
          </div>
          <div className="p-4 bg-green-100 text-green-700 rounded shadow-md">
            <h3 className="text-lg font-semibold">Jumlah Transaksi 6 Bulan Terakhir</h3>
            <div style={{ height: '300px' }}> {/* Set explicit height */}
              <Pie data={transactionsLastSixMonthsData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;

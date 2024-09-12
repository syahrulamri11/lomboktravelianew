
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';
import Link from 'next/link';


const Dashboard = () => {
  const paketTourData = {
    labels: ['Paket 1', 'Paket 2', 'Paket 3', 'Paket 4', 'Paket 5', 'Paket 6'],
    datasets: [
      {
        label: 'Paket Wisata Paling Sering di Order',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const bulanData = {
    labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    datasets: [
      {
        label: 'Bulan Paling Banyak Transaksi',
        data: [3, 2, 2, 6, 7, 4, 3, 7, 6, 8, 9, 10],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-100 h-screen p-5">
        <div className="mb-8">
          <img src="/path-to-logo.png" alt="Lombok Travelia" className="w-32 mx-auto" />
          <h2 className="text-center mt-4">Kim S.Y</h2>
          <p className="text-center text-gray-600">Admin</p>
        </div>
        <nav className="space-y-4">
          <Link href="/admin/dashboard" passHref legacyBehavior>
            <a className="block text-blue-600">Dashboard</a>
          </Link>
          <Link href="/admin/paket-tour" passHref legacyBehavior>
            <a className="block text-gray-600 hover:text-blue-600">Paket Tour</a>
          </Link>
          <Link href="/admin/destinasi" passHref legacyBehavior>
            <a className="block text-gray-600 hover:text-blue-600">Destinasi</a>
          </Link>
          <Link href="/admin/gallery" passHref legacyBehavior>
            <a className="block text-gray-600 hover:text-blue-600">Gallery</a>
          </Link>
          <Link href="/admin/pesanan" passHref legacyBehavior>
            <a className="block text-gray-600 hover:text-blue-600">Pesanan</a>
          </Link>
          <Link href="/admin/saldo" passHref legacyBehavior>
            <a className="block text-gray-600 hover:text-blue-600">Saldo</a>
          </Link>
          <Link href="/admin/pengguna" passHref legacyBehavior>
            <a className="block text-gray-600 hover:text-blue-600">Pengguna</a>
          </Link>
        </nav>
      </aside>
      <main className="w-3/4 p-10">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-green-600 text-white p-4 rounded">
            <h3 className="text-lg">6</h3>
            <p>Total Paket Tour</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded">
            <h3 className="text-lg">10</h3>
            <p>Total Destinasi</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded">
            <h3 className="text-lg">2000</h3>
            <p>Total Pengguna</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded">
            <h3 className="text-lg">Rp.9,000,000</h3>
            <p>Total Saldo</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded">
            <h3 className="text-lg">8</h3>
            <p>Total Pesanan</p>
          </div>
        {/* </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-200 p-6 rounded">
            <h3 className="text-lg mb-4">Statistik Paket Wisata Paling Sering di Order</h3>
            <Bar data={paketTourData} />
          </div>
          <div className="bg-gray-200 p-6 rounded">
            <h3 className="text-lg mb-4">Bulan Paling Banyak Transaksi</h3>
            <Bar data={bulanData} />
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

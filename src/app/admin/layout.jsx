import Sidebar from '../../components/sidebar';
import Dashboard from './page'; // Sesuaikan path ke file page.jsx
import '../../app/globals.css'; // Pastikan Anda sudah mengatur Tailwind CSS

export default function AdminDashboardLayout() {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <main className="flex-grow p-10 bg-white">
          <Dashboard />
        </main>
      </body>
    </html>
  );
}

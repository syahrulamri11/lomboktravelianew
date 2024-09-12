import Link from 'next/link';

const Sidebar = () => {
  return (
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
  );
};

export default Sidebar;

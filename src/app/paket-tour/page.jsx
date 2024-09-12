import Link from 'next/link';

export default function PaketTour() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 text-black">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold px-3">Daftar Paket Tour Lengkap</h1>
      </header>
      <section className="w-full max-w-4xl mx-auto mt-10 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold">Paket Reguler</h3>
            <p className="mt-2">Deskripsi singkat tentang Paket Reguler.</p>
            <Link href="/paket-tour/reguler" className="mt-4 text-blue-500 hover:underline">Read more</Link>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold">Paket Extraordinary</h3>
            <p className="mt-2">Deskripsi singkat tentang Paket Extraordinary.</p>
            <Link href="/paket-tour/extraordinary" className="mt-4 text-blue-500 hover:underline">Read more</Link>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold">Paket Honeymoon</h3>
            <p className="mt-2">Deskripsi singkat tentang Paket Honeymoon.</p>
            <Link href="/paket-tour/honeymoon" className="mt-4 text-blue-500 hover:underline">Read more</Link>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold">Paket One Day Trip</h3>
            <p className="mt-2">Deskripsi singkat tentang Paket One Day Trip.</p>
            <Link href="/paket-tour/onedaytrip" className="mt-4 text-blue-500 hover:underline">Read more</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client'

export default function PaketTourDetail({ params }) {
  const { id } = params;

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold">Loading...</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">Detail Paket - {id}</h1>
      </header>
      <section className="w-full max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
        <img src={`/assets/images/${id}.jpg`} alt={`Trip ${id}`} className="w-full h-64 object-cover rounded-t-lg" />
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Deskripsi</h2>
          <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Daerah Wisata</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>Gili Trawangan</li>
            <li>Malimbu</li>
            <li>... and so on</li>
          </ul>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Itinerary</h2>
          <p className="mt-2">Day 1: Lorem Ipsum...</p>
          <p className="mt-2">Day 2: Lorem Ipsum...</p>
          <p className="mt-2">Day 3: Lorem Ipsum...</p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Include Paket</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>Akomodasi Selama Di Lombok</li>
            <li>Hotel AC 2 Malam</li>
            <li>... and so on</li>
          </ul>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Not Include</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>Tiket Pesawat PP</li>
            <li>... and so on</li>
          </ul>
        </div>
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded">Pesan Sekarang</button>
          <button className="bg-green-500 text-white py-2 px-4 rounded">Konsultasi WA</button>
        </div>
      </section>
    </div>
  );
}

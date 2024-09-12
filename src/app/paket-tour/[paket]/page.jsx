import Link from 'next/link';

export default function PaketTourList({ params }) {
  const { paket } = params;
  const paketList = {
    reguler: [
      { title: "Trip 3D2N - Gili Trawangan", id: "trip1" },
      { title: "Trip 3D2N - Gili Nanggu", id: "trip2" },
      { title: "Trip 3D2N - Sasak Tour & Gili Kondo", id: "trip3" },
      { title: "Trip 3D2N - Sasak Tour & Pantai Pink", id: "trip4" },
    ],
    // Add other paket lists here
  };

  return (
    <div>
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">Daftar Paket Tour {paket.charAt(0).toUpperCase() + paket.slice(1)}</h1>
        <div>Banner and Narrative here</div>
      </header>
      <section className="w-full max-w-4xl mx-auto mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paketList[paket].map((tour) => (
            <div key={tour.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold">{tour.title}</h3>
              <Link href={`/paket-tour/${paket}/${tour.id}`} legacyBehavior>
                <a className="mt-4 text-blue-500 hover:underline">Read more</a>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

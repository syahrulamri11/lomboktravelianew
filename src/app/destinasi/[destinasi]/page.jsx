import Link from 'next/link';

export default function DestinasiTourList({ params }) {
  const { destinasi } = params;
  const destinasiList = {
    wisatapantai: [
      { title: "Gili Trawangan", id: "destinasi1" },
      { title: "Gili Nanggu", id: "destinasi2" },
      { title: "Gili Kondo", id: "destinasi3" },
      { title: "Pantai Pink", id: "destinasi4" },
    ],
    wisatadesaairterjun: [
      { title: "Trip Desa A", id: "desa1" },
      { title: "Trip Desa B", id: "desa2" },
    ],
    wisatabudaya: [
      { title: "Trip Budaya A", id: "budaya1" },
      { title: "Trip Budaya B", id: "budaya2" },
    ],
    wisatakuliner: [
      { title: "Trip Kuliner A", id: "kuliner1" },
      { title: "Trip Kuliner B", id: "kuliner2" },
    ],
  };

  // Check if destinasi exists in destinasiList
  if (!destinasiList[destinasi]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Destinasi tidak ditemukan</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">Daftar Destinasi Tour {destinasi.charAt(0).toUpperCase() + destinasi.slice(1)}</h1>
        <div>Banner and Narrative here</div>
      </header>
      <section className="w-full max-w-6xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinasiList[destinasi].map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <Link href={`/destinasi/${destinasi}/${item.id}`} legacyBehavior>
                <a className="mt-4 text-blue-500 hover:underline">Read more</a>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

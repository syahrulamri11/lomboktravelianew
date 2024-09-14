"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@nextui-org/react';

export default function DestinasiPage({ params }) {
  const [destinations, setDestinations] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { destinasi } = params;

  useEffect(() => {
    async function fetchDestinations() {
      const jenis_destinasi = searchParams.get('jenis_destinasi');
      if (jenis_destinasi) {
        const res = await fetch(`/api/destinasi?jenis_destinasi=${encodeURIComponent(jenis_destinasi)}`);
        const { data } = await res.json();
        setDestinations(data);
      }
    }
    fetchDestinations();
  }, [searchParams]);

  if (!destinations.length) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold text-green-900 dark:text-green-100">
            Loading...
          </h1>
        </header>
      </div>
    );
  }

  const limitWords = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 mt-10 text-center">Destinasi {destinasi}</h1>

      <section className="w-full max-w-4xl mx-auto mt-10 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {destinations.map((dest) => (
            <div
              key={dest.id_destinasi}
              className="border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 duration-300 bg-white dark:bg-gray-100 cursor-pointer"
            >
              <Link href={`/destinasi/${destinasi}/${dest.id_destinasi}`}>
                <Image 
                  src={dest.picture} 
                  alt={dest.nama_destinasi} 
                  width={400} 
                  height={192} 
                  className="w-full h-48 object-cover rounded-t-lg" 
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-green-500">{dest.nama_destinasi}</h3>
                  <p className="text-gray-700 mb-4">{limitWords(dest.deskripsi, 50)}</p>
                  <Button 
                    radius="full" 
                    className="bg-gradient-to-tr from-green-500 to-yellow-500 text-white shadow-lg"
                  >
                    Read more
                  </Button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

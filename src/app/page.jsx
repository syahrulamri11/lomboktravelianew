"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/react";

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data?table=paket tour")
      .then((res) => res.json())
      .then(({data}) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading)
    return (
      <main className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
        <Spinner />;
      </main>
    );

  return (
    <div className="bg-white">
      <section className="text-center py-20 bg-slate-300">
        <h1 className="text-5xl font-bold text-green-600 px-10">
          Explore Lombok with Lombok Travelia
        </h1>
        <p className="text-gray-600 mt-4">
          Lombok Travelia Terdepan Dalam Melayani Anda
        </p>
      </section>

      <section className="py-20 bg-gray-100 px-7">
        <div className="container mx-auto text-black">
          <h2 className="text-3xl font-bold text-center mb-8 ">
            Paket Wisata Populer Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">{item.nama_paket}</h3>
                <p className="text-gray-600 mb-4">{item.deskripsi}</p>
                <Link
                  href={`/paket-tour/paket/${item.nama_paket}`}
                  className="text-green-600 hover:text-green-800"
                >
                  Readmore &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-black">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Layanan Lombok Travelia
          </h2>
          <div className="flex flex-wrap justify-center space-x-8 px-5 gap-5">
            <div className="text-center">
              <img
                src="/path-to-your-image.jpg"
                alt="Family Tour"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold">Family Tour</h3>
              <p className="text-gray-600">
                Menyediakan paket untuk family tour
              </p>
            </div>
            <div className="text-center">
              <img
                src="/path-to-your-image.jpg"
                alt="Group Tour"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold">Group Tour</h3>
              <p className="text-gray-600">
                Menyediakan paket untuk group tour
              </p>
            </div>
            <div className="text-center">
              <img
                src="/path-to-your-image.jpg"
                alt="Honeymoon Tour"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold">Honeymoon Tour</h3>
              <p className="text-gray-600">
                Menyediakan paket untuk honeymoon tour
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100 text-center text-black">
        <h2 className="text-3xl font-bold mb-4">
          Info Lebih Lanjut Hubungi Kami
        </h2>
        <a
          href="https://wa.me/your-whatsapp-number"
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          WhatsApp &rarr;
        </a>
      </section>
    </div>
  );
}

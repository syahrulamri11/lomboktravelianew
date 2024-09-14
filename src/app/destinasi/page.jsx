"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@nextui-org/react';

export default function Destinasi() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-8 mt-10 text-center text-green-800 dark:text-green-100">Daftar Destinasi Tour</h2>
            <div className="w-24 h-1 mx-auto mt-2 bg-green-600"></div>
          </div>

      <section className="w-full max-w-4xl mx-auto mt-10 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 duration-300 bg-white dark:bg-gray-100">
            <Image 
              src="/images/destinasi-pantai.jpg" 
              alt="Wisata Pantai" 
              width={400} 
              height={192} 
              className="w-full h-48 object-cover rounded-t-lg" 
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-green-500">Wisata Pantai</h3>
              <p className="text-gray-700 mb-4">Nikmati keindahan pantai dengan pasir putih dan laut biru.</p>
              <Link href="/destinasi/wisatapantai?jenis_destinasi=Wisata Pantai">
                <Button 
                  radius="full" 
                  className="bg-gradient-to-tr from-green-500 to-yellow-500 text-white shadow-lg"
                >
                  Read more
                </Button>
              </Link>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 duration-300 bg-white dark:bg-gray-100">
            <Image 
              src="/images/destinasi-desa.jpg" 
              alt="Wisata Desa & Air Terjun" 
              width={400} 
              height={192} 
              className="w-full h-48 object-cover rounded-t-lg" 
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-green-500">Wisata Desa & Air Terjun</h3>
              <p className="text-gray-700 mb-4">Jelajahi keindahan desa dan air terjun yang menakjubkan.</p>
              <Link href="/destinasi/wisatadesaairterjun?jenis_destinasi=Wisata Desa dan Air Terjun">
                <Button 
                  radius="full" 
                  className="bg-gradient-to-tr from-green-500 to-yellow-500 text-white shadow-lg"
                >
                  Read more
                </Button>
              </Link>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 duration-300 bg-white dark:bg-gray-100">
            <Image 
              src="/images/destinasi-budaya.jpg" 
              alt="Wisata Budaya" 
              width={400} 
              height={192} 
              className="w-full h-48 object-cover rounded-t-lg" 
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-green-500">Wisata Budaya</h3>
              <p className="text-gray-700 mb-4">Temukan kekayaan budaya lokal yang unik dan menarik.</p>
              <Link href="/destinasi/wisatabudaya?jenis_destinasi=Wisata Budaya">
                <Button 
                  radius="full" 
                  className="bg-gradient-to-tr from-green-500 to-yellow-500 text-white shadow-lg"
                >
                  Read more
                </Button>
              </Link>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 duration-300 bg-white dark:bg-gray-100">
            <Image 
              src="/images/destinasi-kuliner.jpg" 
              alt="Wisata Kuliner" 
              width={400} 
              height={192} 
              className="w-full h-48 object-cover rounded-t-lg" 
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-green-500">Wisata Kuliner</h3>
              <p className="text-gray-700 mb-4">Nikmati berbagai macam kuliner lezat khas daerah yang menggugah selera.</p>
              <Link href="/destinasi/wisatakuliner?jenis_destinasi=Wisata Kuliner">
                <Button 
                  radius="full" 
                  className="bg-gradient-to-tr from-green-500 to-yellow-500 text-white shadow-lg"
                >
                  Read more
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10"></div>
      </section>
    </div>
  );
}

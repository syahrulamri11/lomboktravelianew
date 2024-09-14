"use client";
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const videos = [
  "https://www.youtube.com/embed/4VGUZj_wCrE",
  "https://www.youtube.com/embed/XpaT4uGaBco",
  "https://www.youtube.com/embed/CW1CNpiVjUk",
  "https://www.youtube.com/embed/WpNDOuno0c0",
  "https://www.youtube.com/embed/ShXXioyHPPs",
  "https://www.youtube.com/embed/nMkhZPGDQ24"
];

function GalleryComponent() {
  const [pictures, setPictures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await fetch(`/api/gallery?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pictures');
        }
        const data = await response.json();
        setPictures(data.data);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    };
    fetchPictures();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      router.push(`/gallery?page=${page}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <section className="text-center py-20">
        <div className="container mx-auto px-5 max-w-[1200px]">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Gallery</h2>
            <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-green-400 to-blue-600"></div>
          </div>
          <h3 className="text-3xl mb-8 font-semibold text-gray-900">Lombok Travelia Photo Dump</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 px-6">
            {pictures.map((picture) => (
              <div key={picture.id_gallery} className="relative overflow-hidden rounded-lg shadow-lg group transform transition-all duration-300 hover:scale-105">
                <Image src={picture.image_url} alt={`Foto Wisata ${picture.id_gallery}`} width={400} height={300} className="w-full h-72 object-cover transition-transform duration-300 transform group-hover:scale-110 rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg font-bold">{picture.nama_paket}</p>
                </div>
                <div className="text-center mt-4">
                  <p className="text-gray-800 font-medium">{picture.nama_gallery}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mb-16">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 rounded-full transition-colors duration-300 ${currentPage === index + 1 ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                {index + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)} className="ml-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full">
                Berikutnya
              </button>
            )}
          </div>
          <div className="mb-16 px-6">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">Video Seputar Destinasi di Lombok</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
              {videos.map((video, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                  <iframe
                    width="100%"
                    height="315"
                    src={video}
                    title={`YouTube video player ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-72 rounded-lg"
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Gallery() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryComponent />
    </Suspense>
  );
}

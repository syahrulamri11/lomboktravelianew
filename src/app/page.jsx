"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Spinner, Button } from "@nextui-org/react";
import { UserContext } from "@/utils/userContext";
import { useContext } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export default function Home() {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const [faq1Open, setFaq1Open] = useState(false);
  const [faq2Open, setFaq2Open] = useState(false);
  const [faq3Open, setFaq3Open] = useState(false);
  const [faq4Open, setFaq4Open] = useState(false);

  useEffect(() => {
    fetch("/api/data?table=paket_tour_top3")
      .then((res) => res.json())
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/review') // Fetch all reviews without id_tour
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched reviews:', data); // Debug
        setReviews(data.reviews || []);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  if (isLoading)
    return (
      <main className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
        <Spinner
          style={{ borderTopColor: "#35D235", borderRightColor: "#35D235" }}
        />
      </main>
    );

  return (
    <div className="bg-white">
      <section className="relative text-center py-20 bg-slate-300">
        <Image
          src="images/gili-meno.jpg"
          alt="Explore Lombok"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 text-white px-10">
          {currentUser ? (
            <h1 className="text-5xl font-bold text-green-400 mb-4">
             Hallo {currentUser.nama ? currentUser.nama : currentUser.email} !
            </h1>
          ) : (
            <h1 className="text-5xl font-bold text-green-400 mb-4">
              Explore Lombok with Lombok Travelia
            </h1>
          )}
          <p className="mt-4">
            Lombok Travelia Terdepan Dalam Melayani Anda
          </p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      </section>

      <section className="py-20 bg-gray-100 px-7">
        <div className="container mx-auto text-black">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-600">
            Paket Wisata Populer Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="rounded-xl overflow-hidden h-52 md:h-60 w-full">
                  <Image
                    alt="Paket Tour"
                    src={item.picture ? item.picture : "images/wisata-1.jpeg"}
                    width={400}
                    height={300}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between mt-4">
                  <h3 className="text-xl font-semibold text-green-600 hover:text-green-700 truncate">
                    {item.nama_paket}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base my-4 line-clamp-3">
                    {item.deskripsi.length > 200
                      ? `${item.deskripsi.substring(0, 200)}...`
                      : item.deskripsi}
                  </p>
                  <Link href={`/paket-tour/paket/${item?.id_tour}`} passHref>
                    <Button
                      radius="full"
                      className="mt-auto bg-gradient-to-tr from-green-500 to-yellow-500 text-white py-2 px-4 rounded-full shadow-lg hover:from-green-400 hover:to-yellow-400"
                    >
                      Read more
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 text-black">
        <div className="container mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-green-600">
            Keunggulan Layanan Lombok Travelia
          </h2>
          <div className="flex flex-wrap justify-center gap-10 px-5">
            <div className="flex flex-col items-center max-w-xs p-6 bg-white rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <Image
                src="/images/hargamurahikon.webp"
                alt="Harga Terbaik"
                width={80}
                height={80}
                className="mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">Harga Terbaik</h3>
              <p className="text-gray-800 text-center">
                Kami menawarkan harga yang kompetitif dan terjangkau tanpa
                mengorbankan kualitas layanan.
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs p-6 bg-white rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <Image
                src="/images/waktuikon.webp"
                alt="Mudah & Cepat"
                width={80}
                height={80}
                className="mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">Mudah & Cepat</h3>
              <p className="text-gray-800 text-center">
                Proses pemesanan yang sederhana dan cepat adalah prioritas kami.
                Dengan platform yang user-friendly dan kemudahan akses.
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs p-6 bg-white rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <Image
                src="/images/kesepakatanikon.webp"
                alt="Pilihan Tour Terbaik"
                width={80}
                height={80}
                className="mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">Pilihan Tour Terbaik</h3>
              <p className="text-gray-800 text-center">
                Tersedia beragam pilihan tur yang disesuaikan dengan berbagai
                minat dan preferensi. Mulai dari wisata alam yang menakjubkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-100 to-gray-200 text-black">
        <div className="container mx-auto text-center px-4 lg:px-8 max-w-screen-lg">
          <h2 className="text-4xl font-extrabold mb-8 text-green-600 tracking-wide">
            Apa Kata Mereka?
          </h2>
          <Swiper
            spaceBetween={40}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="mySwiper"
          >
            {reviews && reviews.length > 0 ? (
              reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full mx-auto transition-transform transform
                   hover:scale-105 hover:shadow-2xl flex flex-col justify-between min-h-[280px] border border-gray-200 relative">
                    <div>
                      <div className="flex items-center justify-center mb-4">
                        <Image
                          src={review.picture_url || "/images/profileicon.png"}
                          alt="Profile Picture"
                          width={60}
                          height={60}
                          className="rounded-full border-4 border-blue-300 shadow-md"
                        />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 text-indigo-800">
                        {review.nama}
                      </h3>
                      <p className="italic text-gray-600 mb-4 line-clamp-4">
                        {`"${review.deskripsi}"`}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-center mb-4">
                        {[...Array(parseInt(review.rating))].map((_, i) => (
                          <FaStar
                            key={i}
                            className="text-yellow-500 text-xl mx-1 animate-bounce"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(review._created_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-2 rounded-b-lg bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <p className="text-gray-600">Belum ada review</p>
            )}
          </Swiper>
          <div className="swiper-pagination mt-10 flex justify-center"></div>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-12 text-green-700">
            Galeri Video
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {[
              "XpaT4uGaBco",
              "4VGUZj_wCrE",
              "CW1CNpiVjUk",
              "WpNDOuno0c0",
              "ShXXioyHPPs",
              "nMkhZPGDQ24",
            ].map((videoId, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`YouTube video player ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100">
                    Tonton Video
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12 text-green-600 tracking-wide">
            FAQ
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-l-4 border-green-600 bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full text-left py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 focus:from-gray-200 focus:to-gray-300 transition-colors duration-300 flex items-center justify-between"
                onClick={() => setFaq1Open(!faq1Open)}
              >
                <span className="font-semibold text-lg">Apa yang membuat paket tour Lombok Travelia berbeda dari yang lain?</span>
                <span className="ml-2 text-green-600">
                  {faq1Open ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              {faq1Open && (
                <div className="px-6 py-4 bg-white-100">
                  <p className="text-gray-900">
                    Paket tour Lombok Travelia berbeda karena kami menyediakan layanan eksklusif dengan panduan lokal yang berpengalaman serta destinasi wisata yang keren bagi wisatawan.
                  </p>
                </div>
              )}
            </div>

            <div className="border-l-4 border-green-600 bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full text-left py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 focus:from-gray-200 focus:to-gray-300 transition-colors duration-300 flex items-center justify-between"
                onClick={() => setFaq2Open(!faq2Open)}
              >
                <span className="font-semibold text-lg">Bagaimana cara saya memesan paket tour dengan Lombok Travelia?</span>
                <span className="ml-2 text-green-600">
                  {faq2Open ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              {faq2Open && (
                <div className="px-6 py-4 bg-white-100">
                  <p className="text-gray-900">
                    Anda dapat memesan paket tour melalui website kami dengan mengisi formulir pemesanan yang tersedia di setiap halaman paket tour.
                  </p>
                </div>
              )}
            </div>

            <div className="border-l-4 border-green-600 bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full text-left py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 focus:from-gray-200 focus:to-gray-300 transition-colors duration-300 flex items-center justify-between"
                onClick={() => setFaq3Open(!faq3Open)}
              >
                <span className="font-semibold text-lg">Bagaimana kebijakan pembatalan dan perubahan jadwal dengan Lombok Travelia?</span>
                <span className="ml-2 text-green-600">
                  {faq3Open ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              {faq3Open && (
                <div className="px-6 py-4 bg-white-100">
                  <p className="text-gray-900">
                    Kami memiliki kebijakan pembatalan yang fleksibel. Anda bisa membatalkan atau mengubah jadwal tour paling lambat 72 jam sebelum waktu keberangkatan.
                  </p>
                </div>
              )}
            </div>

            <div className="border-l-4 border-green-600 bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full text-left py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 focus:from-gray-200 focus:to-gray-300 transition-colors duration-300 flex items-center justify-between"
                onClick={() => setFaq4Open(!faq4Open)}
              >
                <span className="font-semibold text-lg">Apakah makanan lokal termasuk dalam paket tour?</span>
                <span className="ml-2 text-green-600">
                  {faq4Open ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              {faq4Open && (
                <div className="px-6 py-4 bg-white-100">
                  <p className="text-gray-900">
                    Ya, setiap paket tour kami sudah termasuk makanan lokal terbaik yang akan memanjakan lidah Anda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100 text-center text-black">
      <h2 className="text-3xl font-bold mb-4">
        Info Lebih Lanjut Hubungi Kami
      </h2>
      <a
        href="https://wa.me/83123456789?text=Hallo%20Saya%20Ingin%20Berkonsultasi%20Untuk%20Paket%20Tour%20Di%20Lombok%20Travelia"
        className="bg-green-600 text-white px-6 py-3 rounded inline-block hover:bg-green-700 transition-colors duration-200"
      >
        WhatsApp &rarr;
      </a>
    </section>
    </div>
  );
}
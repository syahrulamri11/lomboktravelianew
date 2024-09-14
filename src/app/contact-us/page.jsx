"use client";
import Link from 'next/link';
import { useRef } from 'react';
import { FaFacebook, FaWhatsapp, FaInstagram, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';


export default function ContactUs() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_umt41mo', 'template_3l8e47h', form.current, 'Jt-PMfVUvKZZU6Jde')
      .then((result) => {
          console.log(result.text);
          Swal.fire({
            icon: 'success',
            title: 'Pesan berhasil dikirim!',
            showConfirmButton: false,
            timer: 1500
          });
          form.current.reset();
      }, (error) => {
          console.log(error.text);
          Swal.fire({
            icon: 'error',
            title: 'Terjadi kesalahan',
            text: 'Silakan coba lagi.',
            showConfirmButton: false,
            timer: 1500
          });
      });
  };

  return (
    <div className="bg-gray-500">
      <section className="text-center py-20 bg-gradient-to-r from-green-50 via-gray-200 to-green-50 text-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800">Hubungi Kami</h2>
            <div className="w-32 h-1 mx-auto mt-2 bg-green-700"></div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8 mx-auto max-w-3xl">
            <p className="text-gray-700 mb-6">
              <strong className="text-green-800">Lombok Travelia</strong> adalah agen wisata dari Lombok yang berfokus pada Tour dan Travel yang dirancang untuk mendukung keinginan wisatawan yang berkunjung ke Lombok. Lombok Travelia berada di bawah naungan CV. Lombok Travelia yang berpusat di kota Mataram.
            </p>
            <p className="text-gray-700 mb-6">
              Untuk mendukung Transportasi dan Perjalanan Wisata Anda, Lombok Travelia membentuk tim yang handal, enerjik, kreatif, dan bertanggung jawab pada profesi. Kami menjamin perjalanan Anda akan Aman dan nyaman agar memberikan pengalaman wisata yang berkesan selama di Lombok.
            </p>
            <p className="text-gray-900 italic font-semibold">
              Salam Pariwisata,
              <br />
              <strong className="text-green-800">Lombok Travelia</strong>
            </p>
          </div>

          <h3 className="text-2xl mb-8 font-bold text-green-800 text-center">
            Sistem Pemesanan Dan Pembayaran
          </h3>
          <div className="bg-white p-10 rounded-xl shadow-xl mb-8 mx-auto max-w-4xl">
            <ul className="text-gray-800 list-disc pl-6 space-y-4">
              <li className="flex items-start text-base font-medium border-b border-gray-200 pb-4 mb-4 hover:bg-green-50 hover:text-green-800 transition-colors duration-300">
                <span className="mr-4 text-green-600 text-2xl">📝</span>
                <span>Pemesanan dapat dilakukan melalui situs web kami atau melalui WhatsApp.</span>
              </li>
              <li className="flex items-start text-base font-medium border-b border-gray-200 pb-4 mb-4 hover:bg-green-50 hover:text-green-800 transition-colors duration-300">
                <span className="mr-4 text-green-600 text-2xl">✅</span>
                <span>Pastikan untuk memberikan informasi yang akurat saat melakukan pemesanan.</span>
              </li>
              <li className="flex items-start text-base font-medium border-b border-gray-200 pb-4 mb-4 hover:bg-green-50 hover:text-green-800 transition-colors duration-300">
                <span className="mr-4 text-green-600 text-2xl">💳</span>
                <span>Pembayaran dapat dilakukan melalui transfer bank atau metode lain yang tersedia.</span>
              </li>
              <li className="flex items-start text-base font-medium border-b border-gray-200 pb-4 mb-4 hover:bg-green-50 hover:text-green-800 transition-colors duration-300">
                <span className="mr-4 text-green-600 text-2xl">📧</span>
                <span>Anda akan menerima konfirmasi pemesanan melalui email atau WhatsApp.</span>
              </li>
              <li className="flex items-start text-base font-medium border-b border-gray-200 pb-4 mb-4 hover:bg-green-50 hover:text-green-800 transition-colors duration-300">
                <span className="mr-4 text-green-600 text-2xl">📞</span>
                <span>Jika ada pertanyaan, silakan hubungi layanan pelanggan kami.</span>
              </li>
              <li className="flex items-start text-base font-medium border-b border-gray-200 pb-4 mb-4 hover:bg-green-50 hover:text-green-800 transition-colors duration-300">
                <span className="mr-4 text-green-600 text-2xl">⚠️</span>
                <span>Kebijakan pembatalan dan pengembalian dana berlaku sesuai dengan syarat dan ketentuan.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center text-left mb-8 mx-auto max-w-3xl text-yellow-600">
            <FaExclamationCircle className="mr-2" size={24} />
            <p>Catatan Penting: Mohon pastikan informasi yang diberikan sudah benar sebelum melakukan pembayaran.</p>
          </div>

          <Link href="https://wa.me/83143052787" className="bg-green-600 text-white px-6 py-3 rounded-full mb-8 transition-transform transform hover:scale-105">
            Hubungi Kami
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 mb-12 px-4 py-8">
            <div className="flex-1 lg:w-1/2">
              <h3 className="text-2xl mb-4 font-semibold text-green-800">Alamat</h3>
              <p className="text-gray-700 mb-6">
                Gg. Alor No.2, Rembiga, Kec. Selaparang, Kota Mataram, Nusa Tenggara Barat. 83123
              </p>
              <div className="flex justify-center space-x-6 mb-8">
                <Link
                  href="https://www.facebook.com/lomboktravelia"
                  className="text-blue-600 text-4xl hover:text-blue-700 transition-transform transform hover:scale-110"
                >
                  <FaFacebook />
                </Link>
                <Link
                  href="https://wa.me/83143052787"
                  className="text-green-600 text-4xl hover:text-green-700 transition-transform transform hover:scale-110"
                >
                  <FaWhatsapp />
                </Link>
                <Link
                  href="https://www.instagram.com/lombok_travelia"
                  className="text-pink-600 text-4xl hover:text-pink-700 transition-transform transform hover:scale-110"
                >
                  <FaInstagram />
                </Link>
                <Link
                  href="mailto:lomboktravelia24@gmail.com"
                  className="text-red-600 text-4xl hover:text-red-700 transition-transform transform hover:scale-110"
                >
                  <FaEnvelope />
                </Link>
              </div>
              <h3 className="text-2xl mb-4 font-semibold text-green-800">Lokasi Kami</h3>
              <div className="relative w-full h-80">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg shadow-md border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.354731222753!2d116.12258901478406!3d-8.580659093254935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcddf264fbfbf9b%3A0x48dd5e7c7f3c34cf!2sGg.%20Alor%20No.2%2C%20Rembiga%2C%20Kec.%20Selaparang%2C%20Kota%20Mataram%2C%20Nusa%20Tenggara%20Barat%2083123!5e0!3m2!1sid!2sid!4v1693441826185!5m2!1sid!2sid"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            <div className="flex-1 lg:w-1/2">
              <h3 className="text-2xl mb-4 font-semibold text-green-800">Formulir Kritik & Saran</h3>
              <div className="p-8 bg-white rounded-lg shadow-lg">
                <form ref={form} onSubmit={sendEmail}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                    <input
                      type="text"
                      name="user_name"
                      id="name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="user_email"
                      id="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Pesan</label>
                    <textarea
                      name="message"
                      id="message"
                      rows="5"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="submit"
                      className="bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-green-700 transition-transform transform hover:scale-105"
                    >
                      Kirim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

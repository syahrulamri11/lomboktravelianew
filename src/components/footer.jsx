import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaTimes, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="px-2">
      <div className="bg-green-900 text-white py-8 px-10 rounded-t-xl">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white-800 hover:text-blue-300">Lombok Travelia.</h3>
            <p>&copy; 2024 Lombok Travelia Ltd. All rights reserved</p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="https://www.facebook.com/lomboktravelia" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="w-6 h-6 text-blue-500 hover:text-blue-700" />
              </a>
              <a href="https://www.instagram.com/lombok_travelia" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 text-pink-500 hover:text-pink-700" />
              </a>
              <a href="https://wa.me/6281916025009" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="w-6 h-6 text-green-500 hover:text-green-700" />
              </a>
              <a href="https://x.com/dicoding" target="_blank" rel="noopener noreferrer">
                <FaTimes className="w-6 h-6 text-black-500 hover:text-black-700" />
              </a>
              <a href="mailto:lomboktravelia@gmail.com" target="_blank" rel="noopener noreferrer">
                <FaEnvelope className="w-6 h-6 text-yellow-500 hover:text-yellow-700" />
              </a>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">Main Menu</h3>
            <ul>
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/paket-tour" className="hover:underline">Paket Tour</a></li>
              <li><a href="/destinasi" className="hover:underline">Destinasi</a></li>
              <li><a href="/gallery" className="hover:underline">Gallery</a></li>
              <li><a href="/contact-us" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">Destinasi</h3>
            <ul>
              <li><a href="/destinasi/wisatapantai?jenis_destinasi=Wisata Pantai" className="hover:underline">Wisata Pantai</a></li>
              <li><a href="/destinasi/wisatadesaairterjun?jenis_destinasi=Wisata Desa dan Air Terjun" className="hover:underline">Wisata Desa & Air Terjun</a></li>
              <li><a href="/destinasi/wisatabudaya?jenis_destinasi=Wisata Budaya" className="hover:underline">Wisata Budaya</a></li>
              <li><a href="/destinasi/wisatakuliner?jenis_destinasi=Wisata Kuliner" className="hover:underline">Wisata Kuliner</a></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">Info Wisata</h3>
            <ul>
              <li>
                <a href="https://www.rri.co.id/wisata/501279/36-event-siap-ramaikan-pariwisata-ntb-ini-daftarnya" className="hover:underline" target="_blank" rel="noopener noreferrer">Kalender Wisata</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
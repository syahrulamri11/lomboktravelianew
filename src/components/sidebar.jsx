"use client";

import React, { useContext } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaBox, FaMapMarkedAlt, FaImages, FaClipboardList, FaWallet, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { UserContext } from "@/utils/userContext";
import Image from "next/image";
const Sidebar = () => {
  const pathname = usePathname();
  const [currentUser] = useContext(UserContext); // Mengambil data pengguna dari context
  
  // Fungsi untuk memeriksa apakah link aktif
  const isActive = (pathname, href) => pathname === href;
  const [isHover, setIsHover] = React.useState(false);

  return (
    <div className="flex flex-col bg-gradient-to-r from-gray-800 to-green-900 p-4 text-white h-full rounded">
      <div className='p-1 mb-3 flex justify-start items-center'>
        <div className='flex justify-start items-center gap-2 hover:underline cursor-pointer' onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
          <FaArrowLeft className={`h-3 w-3 ${isHover ? 'rotate-0' : 'rotate-45'} transition-all duration-300`} />
          <Link href="/" className=''>Back</Link>
        </div>
      </div>
      <div className="mb-8">
        <Image
          src={currentUser?.picture_url || "/images/profile.jpg"}
          alt="Profile"
          className="rounded-full w-15 mx-auto"
          width={60}
          height={60}
        />
        <h2 className="text-center mt-4 text-xl font-semibold text-white">{currentUser?.nama || "Kim S.Y"}</h2>
      </div>
      <nav>
        <ul>
          <li className={`mb-4 ${isActive(pathname, '/admin/dashboard') ? 'text-blue-500' : ''}`}>
            <Link href="/admin/dashboard">
              <div className="flex items-center cursor-pointer">
                <FaTachometerAlt className="mr-2" /> Dashboard
              </div>
            </Link>
          </li>
          <li className={`mb-4 ${isActive(pathname, '/admin/paket-tour') ? 'text-blue-500' : ''}`}>
            <Link href="/admin/paket-tour">
              <div className="flex items-center cursor-pointer">
                <FaBox className="mr-2" /> Paket Tour
              </div>
            </Link>
          </li>
          <li className={`mb-4 ${isActive(pathname, '/admin/destinasi') ? 'text-blue-500' : ''}`}>
            <Link href="/admin/destinasi">
              <div className="flex items-center cursor-pointer">
                <FaMapMarkedAlt className="mr-2" /> Destinasi
              </div>
            </Link>
          </li>
          <li className={`mb-4 ${isActive(pathname, '/admin/gallery') ? 'text-blue-500' : ''}`}>
            <Link href="/admin/gallery">
              <div className="flex items-center cursor-pointer">
                <FaImages className="mr-2" /> Gallery
              </div>
            </Link>
          </li>
          <li className={`mb-4 ${isActive(pathname, '/admin/pesanan') ? 'text-blue-500' : ''}`}>
            <Link href="/admin/pesanan">
              <div className="flex items-center cursor-pointer">
                <FaClipboardList className="mr-2" /> Pesanan
              </div>
            </Link>
          </li>
          <li className={`mb-4 ${isActive(pathname, '/admin/saldo') ? 'text-blue-500' : ''}`}>
            <Link href="/admin/saldo">
              <div className="flex items-center cursor-pointer">
                <FaWallet className="mr-2" /> Saldo
              </div>
            </Link>
          </li>
          <li className={`mb-4 ${isActive(pathname, '/admin/pengguna') ? 'text-blue-500' : ''}`}>
            <Link href="/admin/pengguna">
              <div className="flex items-center cursor-pointer">
                <FaUsers className="mr-2" /> Pengguna
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

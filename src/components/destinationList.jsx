import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Swal from 'sweetalert2';

// Fungsi untuk memformat rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
};

const DestinationList = ({ destinations, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fungsi untuk memotong deskripsi menjadi maksimal 80 kata
  const truncateDescription = (description) => {
    const words = description.split(' ');
    if (words.length > 80) {
      return words.slice(0, 80).join(' ') + '...';
    }
    return description;
  };

  // Logika pagination
  const totalPages = Math.ceil(destinations.length / itemsPerPage);
  const currentItems = destinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi untuk menangani penghapusan dengan SweetAlert
  const handleDelete = (id_destinasi) => {
    Swal.fire({
      title: 'Yakin Hapus Data?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id_destinasi);
        Swal.fire(
          'Terhapus!',
          'Data destinasi telah dihapus.',
          'success'
        );
      }
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kelola Destinasi</h1>
      <Link href="/admin/destinasi/tambah">
        <button className="bg-blue-500 text-white px-4 py-2 mb-4 rounded">
          Tambah Destinasi
        </button>
      </Link>
      <table className="w-full max-w-[1920px] rounded-lg bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nama Destinasi</th>
            <th className="py-2 px-4 border-b">Deskripsi</th>
            <th className="py-2 px-4 border-b">Harga</th>
            <th className="py-2 px-4 border-b">Jenis Destinasi</th>
            <th className="py-2 px-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((dest) => (
            <tr key={dest.id_destinasi}>
              <td className="py-2 px-4 border-b">{dest.nama_destinasi}</td>
              <td className="py-2 px-4 border-b text-justify">{truncateDescription(dest.deskripsi)}</td>
              <td className="py-2 px-4 border-b">{formatRupiah(dest.harga)}</td>
              <td className="py-2 px-4 border-b">{dest.jenis_destinasi}</td>
              <td className="py-2 px-4 border-b">
                <div className="flex gap-3 justify-center items-center">
                  <Link href={`/admin/destinasi/edit/${dest.id_destinasi}`}>
                    <FaEdit className="text-blue-500 cursor-pointer mr-4" />
                  </Link>
                  <FaTrash
                    onClick={() => handleDelete(dest.id_destinasi)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DestinationList;

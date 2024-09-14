import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Swal from 'sweetalert2';

const PackageList = ({ packages, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Logika pagination
  const totalPages = Math.ceil(packages.length / itemsPerPage);
  const currentItems = packages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id_tour) => {
    Swal.fire({
      title: 'Yakin Hapus Data?',
      text: 'Data yang sudah dihapus tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id_tour);
        Swal.fire(
          'Terhapus!',
          'Data telah berhasil dihapus.',
          'success'
        );
      }
    });
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Kelola Paket Tour</h1>
      <div className="flex justify-center md:justify-start mb-4">
        <Link href="/admin/paket-tour/tambah">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Tambah Paket Tour
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="bg-white border border-gray-200 w-full rounded-lg max-w-full">
          <thead>
            <tr>
              <th className="py-2 px-2 sm:px-4 border-b">Nama Paket Tour</th>
              <th className="py-2 px-2 sm:px-4 border-b">Jenis Paket Tour</th>
              <th className="py-2 px-2 sm:px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((pkg) => (
              <tr key={pkg.id_tour}>
                <td className="py-2 px-2 sm:px-4 border-b">{pkg.nama_paket}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{pkg.jenis_paket}</td>
                <td className="py-2 px-2 sm:px-4 border-b">
                  <div className="flex justify-center gap-2 sm:gap-3">
                    <Link href={`/admin/paket-tour/edit/${pkg.id_tour}`}>
                      <FaEdit className="text-blue-500 cursor-pointer" />
                    </Link>
                    <FaTrash
                      onClick={() => handleDelete(pkg.id_tour)}
                      className="text-red-500 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default PackageList;

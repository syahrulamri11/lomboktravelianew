/* import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

const GalleryList = ({ galleries = [], onDelete }) => {
  if (!Array.isArray(galleries)) {
    return <div>Tidak ada data galeri yang tersedia.</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kelola Galeri</h1>
      <Link href="/admin/gallery/tambah">
        <button className="bg-blue-500 text-white px-4 py-2 mb-4 rounded">
          Tambah Galeri
        </button>
      </Link>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID Gallery</th>
            <th className="py-2 px-4 border-b">Gambar</th>
            <th className="py-2 px-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {galleries.map((gallery) => (
            <tr key={gallery.id_gallery}>
              <td className="py-2 px-4 border-b">{gallery.id_gallery}</td>
              <td className="py-2 px-4 border-b">
                <img
                  src={gallery.image_url}
                  alt={`Gallery ${gallery.id_gallery}`}
                  className="h-16 w-16 object-cover rounded-full"
                />
              </td>
              <td className="py-2 px-4 border-b flex items-center">
                <Link href={`/admin/gallery/edit/${gallery.id_gallery}`}>
                  <FaEdit className="text-blue-500 cursor-pointer mr-4" />
                </Link>
                <FaTrash
                  onClick={() => {
                    if (confirm('Yakin Hapus Data?')) {
                      onDelete(gallery.id_gallery);
                    }
                  }}
                  className="text-red-500 cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GalleryList; */
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Swal from 'sweetalert2';

const GalleryList = ({ galleries = [], onDelete, onPageChange, currentPage, totalPages }) => {
  if (!Array.isArray(galleries)) {
    return <div>Tidak ada data galeri yang tersedia.</div>;
  }

  const handleDelete = (id_gallery) => {
    Swal.fire({
      title: 'Yakin Hapus Data?',
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id_gallery);
        Swal.fire(
          'Dihapus!',
          'Data galeri telah dihapus.',
          'success'
        );
      }
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kelola Galeri</h1>
      <Link href="/admin/gallery/tambah">
        <button className="bg-blue-500 text-white px-4 py-2 mb-4 rounded">
          Tambah Galeri
        </button>
      </Link>
      <table className="min-w-full bg-white rounded-lg border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nama Gallery</th>
            <th className="py-2 px-4 border-b">Gambar</th>
            <th className="py-2 px-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {galleries.map((gallery) => (
            <tr key={gallery.id_gallery}>
              <td className="py-2 px-4 border-b">{gallery.nama_gallery}</td>
              <td className="py-2 px-4 border-b justify-center items-center flex">
                <img
                  src={gallery.image_url}
                  alt={`Gallery ${gallery.nama_gallery}`}
                  className="h-16 w-16 object-cover rounded-full"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <div className='flex gap-3 justify-center items-center'>
                  <FaTrash
                    onClick={() => handleDelete(gallery.id_gallery)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-4 py-2 rounded ${currentPage <= 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Sebelumnya
        </button>
        <span>Halaman {currentPage} Gallery {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 rounded ${currentPage >= totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
};

export default GalleryList;

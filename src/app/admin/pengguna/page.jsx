'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../layout';
import Swal from 'sweetalert2';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const KelolaPengguna = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        const sortedUsers = data?.users.sort((a, b) => a.nama.localeCompare(b.nama));
        setUsers(sortedUsers);
      });
  }, []);

  const deleteUser = (id_user, name) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Deleting ${name} with id: ${id_user}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        fetch(`/api/users`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_user }),
        })
          .then((res) => {
            if (res.ok) {
              setUsers(users.filter((user) => user.id_user !== id_user));
              res.json().then(({ message }) =>
                Swal.fire({
                  title: 'Deleted!',
                  text: message,
                  icon: 'success',
                })
              );
            }
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
            });
          })
          .finally(() => setLoading(false));
      }
    });
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentItems = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-4xl font-bold">Loading...</div>
        </div>
      )}
      <AdminLayout showSidebar={true}>
        <h1 className="text-2xl font-bold mb-4">Kelola Pengguna</h1>
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="py-2">Nama Pengguna</th>
              <th className="py-2">Email</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr key={user.id_user} className="border-b">
                <td className="px-4 py-2">{user.nama}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center gap-3">
                    <Link
                      href={{
                        pathname: `/admin/pengguna/edit/${user.id_user}`,
                      }}
                      passHref
                    >
                      <button className="text-blue-500 mr-4">
                        <AiOutlineEdit className="inline-block mr-1" /> Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteUser(user.id_user, user.nama)}
                      className="text-red-500"
                    >
                      <AiOutlineDelete className="inline-block mr-1" /> Hapus
                    </button>
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
      </AdminLayout>
    </>
  );
};

export default KelolaPengguna;

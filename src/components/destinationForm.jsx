'use client';

import { storage } from '@/utils/firebaseConfig';
import { Button, Spinner } from '@nextui-org/react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function DestinationForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    nama_destinasi: initialData.nama_destinasi || '',
    deskripsi: initialData.deskripsi || '',
    harga: initialData.harga || '',
    jenis_destinasi: initialData.jenis_destinasi || '',
    picture: initialData.picture || '/images/gili-nanggu.jpg',
  });

  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImgUpload = () => {
    if (file) {
      if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Format File Salah: .jpg .jpeg .png .gif',
        });
        return;
      }
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setIsUploading(true);
          setUploadingStatus('Uploading ' + Math.floor(progress) + '%');
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, picture: downloadURL });
            setIsUploading(false);
          });
        }
      );
    } else {
      console.log('no image selected');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi harga sebagai angka
    if (isNaN(formData.harga)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Harga harus berupa angka.',
      });
      return;
    }

    try {
      // Kirim data ke fungsi onSubmit (pastikan fungsi ini sudah terdefinisi dengan benar)
      await onSubmit(formData);

      // Notifikasi destinasi berhasil ditambahkan
      Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Destinasi berhasil ditambahkan.',
      });

      // Atur ulang form setelah berhasil submit
      setFormData({
        nama_destinasi: '',
        deskripsi: '',
        harga: '',
        jenis_destinasi: '',
        picture: '/images/gili-nanggu.jpg',
      });
      setFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Tambahkan logika notifikasi atau tindakan lain jika ada kesalahan dalam pengiriman data
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Nama Destinasi</label>
        <input
          type="text"
          name="nama_destinasi"
          value={formData.nama_destinasi}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Jenis Destinasi</label>
        <select
          name="jenis_destinasi"
          value={formData.jenis_destinasi}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Pilih Jenis Destinasi</option>
          <option value="Wisata Pantai">Wisata Pantai</option>
          <option value="Wisata Desa dan Air Terjun">Wisata Desa dan Air Terjun</option>
          <option value="Wisata Budaya">Wisata Budaya</option>
          <option value="Wisata Kuliner">Wisata Kuliner</option>
        </select>
      </div>
      <div className="flex flex-col gap-3">
        <label className="block mb-2">Picture</label>
        <div className="relative w-full h-72 rounded-md overflow-hidden">
          <Image
            alt="Picture"
            src={formData.picture}
            height={1000}
            width={1000}
            className="w-full h-full object-cover object-center"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center">
              <Spinner />
              <h1 className="text-white">{uploadingStatus}</h1>
            </div>
          )}
        </div>
        <div className="flex">
          <input
            type="file"
            name="picture"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded rounded-r-none"
          />
          <Button size="lg" className="rounded-l-none" color="primary" onClick={handleImgUpload}>
            <FiUpload className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div>
        <label className="block mb-2">Deskripsi</label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        ></textarea>
      </div>
      <div>
        <label className="block mb-2">Harga</label>
        <input
          type="text"
          name="harga"
          value={formData.harga}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
     </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialData.id_destinasi ? 'Edit' : 'Tambah'}
      </button>
    </form>
  );
}

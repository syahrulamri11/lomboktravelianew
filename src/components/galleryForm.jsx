import { storage } from '@/utils/firebaseConfig';
import { Button, Spinner } from '@nextui-org/react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function GalleryForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    id_gallery: initialData.id_gallery || '',
    nama_gallery: initialData.nama_gallery || '',  // Tambahkan ini
    image_url: initialData.image_url || '/images/gili-air.jpg',
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
      if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Format File Salah: .jpg .jpeg .png .gif .webp',
        });
        return;
      }
      const storageRef = ref(storage, `gallery/${file.name}`);
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
            setFormData({ ...formData, image_url: downloadURL });
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

    try {
      await onSubmit(formData);

      Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Galeri berhasil ditambahkan.',
      });

      setFormData({
        id_gallery: '',
        nama_gallery: '',  // Reset nilai ini juga
        image_url: '/images/gili-air.jpg',
      });
      setFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">ID Gallery</label>
        <input
          type="text"
          name="id_gallery"
          value={formData.id_gallery}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Nama Gallery</label>
        <input
          type="text"
          name="nama_gallery"
          value={formData.nama_gallery}  // Binding input ke state
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="block mb-2">Picture</label>
        <div className="relative w-full h-72 rounded-md overflow-hidden">
          <Image
            alt="Image"
            src={formData.image_url}
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
            name="image_url"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded rounded-r-none"
          />
          <Button size="lg" className="rounded-l-none" color="primary" onClick={handleImgUpload}>
            <FiUpload className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialData.id_gallery ? 'Edit' : 'Tambah'}
      </button>
    </form>
  );
}

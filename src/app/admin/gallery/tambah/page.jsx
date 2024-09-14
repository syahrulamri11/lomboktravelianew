"use client";

import { useRouter } from 'next/navigation';
import GalleryForm from '@/components/galleryForm';
import AdminLayout from '../../layout';

const AddPicture = () => {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal menambahkan gambar');
      }

      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Gallery</h1>
        <GalleryForm onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  );
};

export default AddPicture;

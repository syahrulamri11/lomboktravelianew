"use client";

import { useRouter } from 'next/navigation';
import PackageForm from '@/components/packageForm';
import AdminLayout from '../../layout';

export default function AddPackageTour() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      console.log(formData);
      const response = await fetch('/api/paket-tour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal menambahkan paket tour');
      }

      // Redirect to admin package tour page after successful submit
      router.push('/admin/paket-tour');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error if necessary
    }
  };

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Paket Tour</h1>
        <PackageForm onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  );
}

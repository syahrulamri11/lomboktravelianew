/* 'use client';

import DestinationForm from '../../../../components/destinationForm';
import AdminLayout from '../../layout';

const AddDestinationPage = () => {
  const handleAddDestination = (destination) => {
    // Logic untuk menambah destinasi
    console.log('New Destination:', destination);
  };
  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto">
        <DestinationForm onSubmit={handleAddDestination} />
      </div>
    </AdminLayout>
  );
};

export default AddDestinationPage; */

"use client";

import { useRouter } from 'next/navigation';
import DestinationForm from '@/components/destinationForm';
import AdminLayout from '../../layout';

export default function AddDestinationPage() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/destinasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add destination');
      }

      // Redirect to admin destination page after successful submit
      router.push('/admin/destinasi');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error if necessary
    }
  };

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Destinasi</h1>
        <DestinationForm onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  );
}

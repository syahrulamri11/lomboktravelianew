'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DestinationForm from '@/components/destinationForm';
import AdminLayout from '../../../layout';

export default function EditDestinationTour({params}) {
  const router = useRouter();
  const { id } = params;// Destructure id from router.query
  const [destinationData, setDestinationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (id) {
          const res = await fetch(`/api/destinasi?id=${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch data');
          }
          const { data } = await res.json();
          setDestinationData(data);
        } else {
          throw new Error('ID parameter not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData(); // Call fetchData when component mounts or when id changes
  }, [id]); // useEffect dependency on id

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/destinasi?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Failed to update data');
      }
      router.push('/admin/destinasi'); // Redirect to destinasi tour list page after successful update
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!destinationData) return <div>Error fetching destinasi data.</div>;

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit destination</h1>
        <DestinationForm onSubmit={handleSubmit} initialData={destinationData} />
      </div>
    </AdminLayout>
  );
}

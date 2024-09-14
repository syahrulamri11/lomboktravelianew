'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PackageForm from '@/components/packageForm';
import AdminLayout from '../../../layout';

export default function EditPackageTour({params}) {
  const router = useRouter();
  const { id } = params;// Destructure id from router.query
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(packageData)
  }, [packageData])

  useEffect(() => {
    async function fetchData() {
      try {
        if (id) {
          const res = await fetch(`/api/paket-tour?id=${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch data');
          }
          const { data } = await res.json();
          setPackageData(data);
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
      const res = await fetch(`/api/paket-tour?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Failed to update data');
      }
      router.push('/admin/paket-tour'); // Redirect to package tour list page after successful update
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!packageData) return <div>Error fetching package data.</div>;

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4 ml-10">Edit Paket Tour</h1>
        <PackageForm onSubmit={handleSubmit} initialData={packageData} />
      </div>
    </AdminLayout>
  );
}
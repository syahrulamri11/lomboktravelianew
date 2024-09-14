"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DestinationList from '../../../components/destinationList';
import AdminLayout from '../layout';

export default function DestinationPage() {
  const [destinations, setDestinations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch('/api/destinasi');
        const { data } = await res.json();
        setDestinations(data);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      }
    }
    fetchDestinations();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/destinasi?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDestinations(destinations.filter((dest) => dest.id_destinasi !== id));
      } else {
        console.error('Failed to delete destination');
      }
    } catch (error) {
      console.error('Error deleting destination:', error);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/destinasi/edit/${id}`);
  };

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto p-6">
        <DestinationList destinations={destinations} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
    </AdminLayout>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PackageList from '../../../components/packageList';
import AdminLayout from '../layout';

export default function PackageTour() {
  const [packages, setPackages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPackages() {
      const res = await fetch('/api/paket-tour');
      const {data} = await res.json();
      setPackages(data);
    }
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/paket-tour?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setPackages(packages.filter((pkg) => pkg.id_tour !== id));
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/paket-tour/edit/${id}`);
  };

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto p-6">
      <PackageList packages={packages} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
    </AdminLayout>
  );
}

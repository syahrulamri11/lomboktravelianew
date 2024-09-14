/*
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../layout';
import GalleryList from '../../../components/galleryList';

const GalleryPage = () => {
  const [pictures, setPictures] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch pictures');
        }
        const data = await response.json();
        setPictures(data.data);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    };
    fetchPictures();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPictures(pictures.filter(picture => picture.id_picture !== id));
      } else {
        console.error('Failed to delete picture');
      }
    } catch (error) {
      console.error('Error deleting picture:', error);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/gallery/edit/${id}`);
  };

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto p-6">
        <GalleryList galleries={pictures} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
    </AdminLayout>
  );
};

export default GalleryPage; */

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../layout';
import GalleryList from '../../../components/galleryList';

const GalleryPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch(`/api/gallery?page=${currentPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch galleries');
        }
        const data = await response.json();
        setGalleries(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching galleries:', error);
      }
    };
    fetchGalleries();
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setGalleries(galleries.filter(gallery => gallery.id_gallery !== id));
      } else {
        console.error('Failed to delete gallery');
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/gallery/edit/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout showSidebar={true}>
      <div className="container mx-auto p-6">
        <GalleryList
          galleries={galleries}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onPageChange={handlePageChange} // Menyertakan prop onPageChange
          currentPage={currentPage} // Menyertakan currentPage
          totalPages={totalPages} // Menyertakan totalPages
        />
      </div>
    </AdminLayout>
  );
};

export default GalleryPage;

'use client';
import { storage } from '@/utils/firebaseConfig';
import { Button, Spinner, Select, SelectItem, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function PackageForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    nama_paket: initialData.nama_paket || '',
    jenis_paket: initialData.jenis_paket || '',
    deskripsi: initialData.deskripsi || '',
    nama_destinasi: initialData.nama_destinasi?.map((dest) => dest) || [],
    harga: initialData.harga || '',
    durasi: initialData.durasi || '',
    availability: initialData.availability || 'true', 
    itinerary: initialData.itinerary?.map((item) => item) || [],
    inclusion: initialData.inclusion?.map((item) => item) || [],
    exclusion: initialData.exclusion?.map((item) => item) || [],
    picture: initialData.picture? initialData.picture : '/images/gili-trawangan-1.jpg',
  });

  const [selectedDestinations, setSelectedDestinations] = useState(new Set(initialData.nama_destinasi));
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItineraryItem, setNewItineraryItem] = useState('');

  useEffect(() => {
    setFormData({ ...formData, nama_destinasi: Array.from(selectedDestinations) });
  }, [selectedDestinations]);

  useEffect(() => {
    console.log(initialData);
  }, [initialData]);

  useEffect(() => {
    // Fetch data destinasi dari API
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinasi'); 
        const data = await response.json();
        setDestinations(data.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    }

    fetchDestinations();
  }, []);

  
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
          icon: "error",
          title: "Oops...",
          text: "Format File Salah: .jpg .jpeg .png .gif",
        });
        return; 
      }
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setIsUploading(true);
          setUploadingStatus("Uploading " + Math.floor(progress) + "%");
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
      console.log("no image selected");
    }
  };

  const handleAddInclusion = () => {
    if (formData.newInclusion) {
      setFormData({
        ...formData,
        inclusion: [...formData.inclusion, formData.newInclusion],
        newInclusion: '', 
      });
    }
  };

  const handleAddExclusion = () => {
    if (formData.newExclusion) {
      setFormData({
        ...formData,
        exclusion: [...formData.exclusion, formData.newExclusion],
        newExclusion: '', 
      });
    }
  };

  const handleRemoveInclusion = (index) => {
    const updatedInclusion = [...formData.inclusion];
    updatedInclusion.splice(index, 1);
    setFormData({ ...formData, inclusion: updatedInclusion });
  };

  const handleRemoveExclusion = (index) => {
    const updatedExclusion = [...formData.exclusion];
    updatedExclusion.splice(index, 1);
    setFormData({ ...formData, exclusion: updatedExclusion });
  };
  const handleAddItinerary = () => {
    if (newItineraryItem.trim() !== '') {
      setFormData({
        ...formData,
        itinerary: [...formData.itinerary, newItineraryItem],
      });
      setNewItineraryItem('');
      setShowModal(false);
    }
  };

  const handleRemoveItinerary = (index) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary.splice(index, 1);
    setFormData({ ...formData, itinerary: updatedItinerary });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi harga sebagai angka
    if (isNaN(formData.harga)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harga harus berupa angka.",
      });
      return;
    }

    // Validasi durasi sebagai angka
    if (isNaN(formData.durasi)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Durasi harus berupa angka.",
      });
      return;
    }

    try {
      // Kirim data ke fungsi onSubmit (pastikan fungsi ini sudah terdefinisi dengan benar)
      await onSubmit(formData);

      // Notifikasi paket tour berhasil ditambahkan
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Paket Tour berhasil ditambahkan.",
      });

      // Atur ulang form setelah berhasil submit
      setFormData({
        nama_paket: '',
        jenis_paket: '',
        deskripsi: '',
        nama_destinasi: [],
        harga: '',
        durasi: '',
        availability: 'true',
        itinerary: [],
        inclusion: [],
        exclusion: [],
        picture: '/images/gili-trawangan-1.jpg',
      });
      setFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Tambahkan logika notifikasi atau tindakan lain jika ada kesalahan dalam pengiriman data
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Nama Paket Tour</label>
        <input
          type="text"
          name="nama_paket"
          value={formData.nama_paket}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Jenis Paket Tour</label>
        <select
          name="jenis_paket"
          value={formData.jenis_paket}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Pilih Paket Tour</option>
          <option value="Paket Reguler">Paket Reguler</option>
          <option value="Paket Extraordinary">Paket Extraordinary</option>
          <option value="Paket Honeymoon">Paket Honeymoon</option>
          <option value="Paket One-Day-Trip">Paket One Day Trip</option>
        </select>
      </div>
      <div className='flex flex-col gap-3'>
        <label className="block mb-2">Picture</label>
        <div className='relative w-full h-72 rounded-md overflow-hidden'>
          <Image alt="Picture" src={formData.picture? formData.picture : '/images/gili-trawangan-1.jpg'} height={1000} width={1000} className='w-full h-full object-cover object-center'></Image>
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center">
              <Spinner></Spinner>
              <h1 className="text-white">{uploadingStatus}</h1>
            </div>
          )}
        </div>
        <div className='flex'>
          <input
            type="file"
            name="picture"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded rounded-r-none"
          />
          <Button size='lg' className=' rounded-l-none' color='primary' onClick={handleImgUpload}>
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
      <div className=''>
        <Select
          label="Nama Destinasi"
          selectionMode="multiple"
          placeholder="Pilih Destinasi"
          selectedKeys={selectedDestinations}
          onSelectionChange={setSelectedDestinations}
          className="w-full rounded"
        >
          {destinations.map((destinasi) => (
            <SelectItem key={destinasi.id_destinasi} value={destinasi.id_destinasi}>
              {destinasi.nama_destinasi}
            </SelectItem>
          ))}
        </Select>
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
      <div>
        <label className="block mb-2">Durasi</label>
        <input
          type="text"
          name="durasi"
          value={formData.durasi}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Availability</label>
        <select name="availability" id="availability" value={formData.availability} onChange={handleChange} className='w-full p-2 border border-gray-300 rounded'>
          <option value="true">Iya</option>
          <option value="false">Tidak</option>
        </select>
      </div>
      <div>
      <label className="block mb-2">Itinerary</label>
        <ul className="list-disc pl-5 space-y-2">
          {formData.itinerary && formData.itinerary.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{item}</span>
              <Button type="button" color="danger" onClick={() => handleRemoveItinerary(index)}>Hapus</Button>
            </li>
          ))}
        </ul>
        <Button type="button" onClick={() => setShowModal(true)} className="mt-2">Tambah Itinerary</Button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ModalContent>
            <ModalHeader>Add New Itinerary</ModalHeader>
            <ModalBody>
              <Textarea
                name="newItineraryItem"
                value={newItineraryItem}
                onChange={(e) => setNewItineraryItem(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleAddItinerary}>Tambah</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <div className='flex flex-col justify-center items-center w-full'>
        <label className="block mb-2 w-full">Inclusion</label>
        <div className="flex gap-2 w-full">
          <Input
            variant="bordered"
            type="text"
            name="newInclusion"
            value={formData.newInclusion}
            onChange={handleChange}
            size="lg"
            placeholder="Tambah Inclusion"
          />
          <Button size='lg' onClick={handleAddInclusion}>Tambah</Button>
        </div>
        {formData.inclusion.length>0 && (
          <div className='w-full flex flex-col gap-3 mt-3'>
            {formData.inclusion && formData.inclusion.map((item, index) => (
              <div key={index} className="flex justify-between items-center border border-green-300 rounded-xl py-2 px-3 w-10/12 mx-auto">
                <div className='w-full'>
                  <h1 className='truncate w-[1150px]'>{item}</h1>
                </div>
                <Button onClick={() => handleRemoveInclusion(index)} className="ml-2 px-4 py-2" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}><FiTrash2 className="text-red-500 text-xl"/></Button>
              </div>
            ))}
          </div>
      )}  
      </div>
      <div className='flex flex-col justify-center items-center w-full'>
        <label className="block mb-2 w-full">Exclusion</label>
        <div className="flex gap-2 w-full">
          <Input
            type="text"
            name="newExclusion"
            value={formData.newExclusion}
            onChange={handleChange}
            size="lg"
            placeholder="Tambah Exclusion"
            variant="bordered"
          />
          <Button size='lg' onClick={handleAddExclusion}>Tambah</Button>
        </div>
        {formData.exclusion.length>0 && (
          <div className='w-full flex flex-col gap-3 mt-3'>
            {formData.exclusion && formData.exclusion.map((item, index) => (
              <div key={index} className="flex justify-between items-center border border-green-300 rounded-xl py-2 px-3 w-10/12 mx-auto">
                <div className='w-full'>
                  <h1 className='truncate w-[1150px]'>{item}</h1>
                </div>
                <Button onClick={() => handleRemoveExclusion(index)} className="ml-2 px-4 py-2" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}><FiTrash2 className="text-red-500 text-xl"/></Button>
              </div>
            ))}
          </div>     
        )}
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialData.id_tour ? 'Edit' : 'Tambah'}
      </button>
    </form>
    </div>
  );
}
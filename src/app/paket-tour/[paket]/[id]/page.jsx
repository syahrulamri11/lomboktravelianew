/* 'use client';

import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/utils/userContext';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const destinationsData = [
  { name: 'Gili Trawangan', price: 500000 },
  { name: 'Malimbu', price: 500000 },
  { name: 'Pantai Pink', price: 50000 },
  // Tambahkan destinasi lain dengan harga mereka
];

export default function PaketTourDetail({ params }) {
  const { id } = params;
  const [selectedDestinations, setSelectedDestinations] = useState(destinationsData);
  const [removedDestinations, setRemovedDestinations] = useState([]);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [rating, setRating] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      // Cek apakah user sudah pernah memesan paket ini
      fetch(`/api/check-order?user=${currentUser.id_user}&tour=${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(({ success }) => {
          setHasOrdered(success);
        })
        .catch((error) => {
          console.error('There was an error fetching the order status:', error);
        });
    }
  }, [currentUser, id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Loading...</h1>
        </header>
      </div>
    );
  }

  const handleRemoveDestination = (destinationName) => {
    const destinationToRemove = selectedDestinations.find(dest => dest.name === destinationName);
    const updatedDestinations = selectedDestinations.filter(dest => dest.name !== destinationName);
    setSelectedDestinations(updatedDestinations);
    setRemovedDestinations([...removedDestinations, destinationToRemove]);
  };

  const handleRestoreDestination = (destinationName) => {
    const destinationToRestore = removedDestinations.find(dest => dest.name === destinationName);
    const updatedRemovedDestinations = removedDestinations.filter(dest => dest.name !== destinationName);
    setSelectedDestinations([...selectedDestinations, destinationToRestore]);
    setRemovedDestinations(updatedRemovedDestinations);
  };

  const totalCost = selectedDestinations.reduce((acc, dest) => acc + dest.price, 0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_tour: id,
        id_order: "", // Ambil id_order yang relevan dari hasil validasi
        rating,
        deskripsi,
      }),
    });

    if (response.ok) {
      // Refresh halaman atau tampilkan notifikasi sukses
    }
  };

  const handleOrder = async () => {
    if (!currentUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to place an order.',
      });
      return;
    }

    const orderId = `ORDER-${Date.now()}`;
    const orderData = {
      id_user: currentUser.id_user,
      id_tour: id,
      total_cost: totalCost,
    };

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      const { token } = await response.json();
      window.snap.pay(token, {
        onSuccess: function (result) {
          // Handle success
          console.log('Payment success:', result);
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
            text: 'Thank you for your order!',
          });
        },
        onPending: function (result) {
          // Handle pending
          console.log('Payment pending:', result);
        },
        onError: function (result) {
          // Handle error
          console.log('Payment error:', result);
        },
        onClose: function () {
          // Handle close
          console.log('Payment popup closed without finishing payment');
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'Unable to process the payment. Please try again later.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Detail Paket - {decodeURIComponent(id)}</h1>
      </header>
      <section className="w-full max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <img src={`/assets/images/${id}.jpg`} alt={`Trip ${id}`} className="w-full h-64 object-cover rounded-t-lg" />
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Deskripsi</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Daerah Wisata</h2>
          <ul className="list-disc ml-6 mt-2">
            {selectedDestinations.map((destination, index) => (
              <li key={index} className="flex items-center justify-between text-gray-900 dark:text-gray-100">
                <span>{destination.name} - {formatRupiah(destination.price)}</span>
                <button
                  onClick={() => handleRemoveDestination(destination.name)}
                  className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 transition duration-300 ease-in-out"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {removedDestinations.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Destinasi yang Dihapus</h2>
            <ul className="list-disc ml-6 mt-2">
              {removedDestinations.map((destination, index) => (
                <li key={index} className="flex items-center justify-between text-gray-900 dark:text-gray-100">
                  <span>{destination.name} - {formatRupiah(destination.price)}</span>
                  <button
                    onClick={() => handleRestoreDestination(destination.name)}
                    className="ml-4 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600 transition duration-300 ease-in-out"
                  >
                    <FontAwesomeIcon icon={faUndoAlt} className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Total Cost: {formatRupiah(totalCost)}</h2>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Itinerary</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">Day 1: Lorem Ipsum...</p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">Day 2: Lorem Ipsum...</p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">Day 3: Lorem Ipsum...</p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Include Paket</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-700 dark:text-gray-300">
            <li>Hotel</li>
            <li>Transportasi</li>
            <li>Makan</li>
          </ul>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Excludes Paket</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-700 dark:text-gray-300">
            <li>Asuransi Perjalanan</li>
            <li>Pengeluaran Pribadi</li>
          </ul>
        </div>
        <button
          onClick={handleOrder}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Pesan Sekarang
        </button>
        <button
          onClick={() => {
            const packageName = decodeURIComponent(id);
            const message = `Halo, Saya ingin konsultasi paket ${packageName} apakah anda dapat membantu saya?`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/6285338717747?text=${encodedMessage}`, '_blank');
          }}
          className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Konsultasi WA
        </button>
      </section>
      {hasOrdered && (
        <section className="w-full max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Tulis Ulasan</h2>
          <form onSubmit={handleSubmitReview}>
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-300">Rating:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-300">Deskripsi:</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Kirim Ulasan
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
*/
"use client";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/utils/userContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

const RenderStars = ({ rating, onRatingChange }) => {
  const handleStarClick = (starIndex) => {
    onRatingChange(starIndex + 1);
  };

  return (
    <div className="flex">
      {[...Array(5)].map((star, index) => (
        <FaStar
          key={index}
          size={24}
          color={index < rating ? "#ffc107" : "#e4e5e9"}
          onClick={() => handleStarClick(index)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  );
};

export default function PaketTourDetail({ params }) {
  const [id, setId] = useState(params?.id);
  const [refId, setRefId] = useState(null);

  const [tourDetails, setTourDetails] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [removedDestinations, setRemovedDestinations] = useState([]);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [rating, setRating] = useState(0); // Initialize rating with a number
  const [reviews, setReviews] = useState([]);
  const [deskripsi, setDeskripsi] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [selectedCustomDestinations, setSelectedCustomDestinations] = useState(
    []
  );
  const [hargaTotal, setHargaTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/paket-tour?id=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tour details");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setTourDetails(data?.data);
        console.log(data.data);
        setSelectedDestinations(data?.data?.nama_destinasi || []);
      })
      .catch((error) => {
        console.error("Error fetching tour details:", error);
      });

    fetch(`/api/destinasi`) // Fetch complete list of destinations
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch destinations");
        }
        return res.json();
      })
      .then((data) => {
        setDestinations(data.data); // Assuming data.data contains array of destinations
      })
      .catch((error) => {
        console.error("Error fetching destinations:", error);
      });

    if (currentUser) {
      fetch(`/api/check-order?user=${currentUser.id_user}&tour=${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch order status");
          }
          return res.json();
        })
        .then(({ success }) => setHasOrdered(success))
        .catch((error) => {
          console.error("Error fetching order status:", error);
        });
    }

    fetch(`/api/review?id_tour=${id}`) // Fetch reviews
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [currentUser, id]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    calculateHargaTotal();
  }, [tourDetails]);

  const calculateHargaTotal = () => {
    const paketPrice = parseInt(tourDetails?.harga) || 0;
    const destinationTotalPrice = destinations
      .filter((dest) => tourDetails.nama_destinasi.includes(dest.id_destinasi))
      .reduce((acc, curr) => acc + parseInt(curr.harga), 0);
    setHargaTotal(paketPrice + destinationTotalPrice);
  };

  const handleSelectDestination = (destinationId) => {
    setSelectedCustomDestinations((prevSelected) =>
      prevSelected.includes(destinationId)
        ? prevSelected.filter((id) => id !== destinationId)
        : [...prevSelected, destinationId]
    );
  };

  const handleSubmitCustomDestinations = async () => {
    const response = await fetch(`/api/paket-tour/${id}/custom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nama_destinasi: selectedCustomDestinations }),
    });

    const res = await response.json();
    
    if (response.ok) {
      const { id_tour } = res.data;
      Swal.fire({
        icon: "success",
        title: "Custom Destinations Added",
        text: "Your custom destinations have been added successfully.",
      });

      handleCloseModal();
      setRefId(id);
      setId(id_tour);
      // router.push(`/paket-tour/paket/${id_tour}`);
    } else {
      if(res.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Harap Login terlebih dahulu.",
        });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Failed to Add Custom Destinations",
        text: "An error occurred while adding your custom destinations. Please try again.",
      });
    }
  };

  // Jika data masih dimuat atau tourDetails belum ada, tampilkan pesan "Loading..."
  if (!id || !tourDetails) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold text-green-900 dark:text-green-100">
            Loading...
          </h1>
        </header>
      </div>
    );
  }
  // Map destination IDs to their names
  const destinationNames = selectedDestinations.map((destId) => {
    const destination = destinations.find((d) => d.id_destinasi === destId);
    console.log("Mapping ID:", destId, "to destination:", destination);
    return destination
      ? { nama: destination.nama_destinasi, harga: destination.harga }
      : "Unknown";
  });

  console.log("Selected Destinations:", selectedDestinations);
  console.log("Destination Names:", destinationNames);

  const handleRemoveDestination = (destinationId) => {
    setSelectedDestinations(
      selectedDestinations.filter((id) => id !== destinationId)
    );
  };

  const handleRestoreDestination = (destinationName) => {
    const destinationToRestore = removedDestinations.find(
      (dest) => dest.nama_destinasi === destinationName
    );
    const updatedRemovedDestinations = removedDestinations.filter(
      (dest) => dest.nama_destinasi !== destinationName
    );
    setSelectedDestinations([...selectedDestinations, destinationToRestore]);
    setRemovedDestinations(updatedRemovedDestinations);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!orderId) {
      Swal.fire({
        icon: "error",
        title: "Order ID Missing",
        text: "Order ID is missing. Please complete the payment first.",
      });
      return;
    }

    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_tour: id,
        id_order: orderId, // Ambil id_order yang relevan dari hasil validasi
        rating,
        deskripsi,
      }),
    });
    const addedRev = await response.json();
    const _addedRev = { ...addedRev, nama: currentUser.nama };

    if (response.ok) {
      // Refresh halaman atau tampilkan notifikasi sukses
      Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Thank you for your review!",
      });
      setRating("");
      setDeskripsi("");
      setHasOrdered(false);
      setReviews((prevReviews) => [...prevReviews, _addedRev]);
    } else {
      // Tampilkan pesan kesalahan jika gagal
      const error = await response.json();
      Swal.fire({
        icon: "error",
        title: "Failed to Submit Review",
        text: "An error occurred while submitting your review. Please try again later.",
      });
    }
  };

  const handleOrder = async () => {
    if (!currentUser) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to place an order.",
      });
      return;
    }

    const orderData = {
      id_user: currentUser.id_user,
      id_tour: id,
      amount: hargaTotal,
      email: currentUser.email,
    };

    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      const { token, orderId } = await response.json();
      setOrderId(orderId);
      window.snap.pay(token, {
        onSuccess: async function (result) {
          // Handle success
          console.log("Payment success:", result);
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: "Thank you for your order!",
          });
          setHasOrdered(true); // Setelah sukses order, ubah status `hasOrdered` menjadi true

          // Generate and send invoice
          const invoiceResponse = await fetch("/api/invoice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_user: currentUser.id_user,
              id_tour: id,
              amount: hargaTotal,
              email: currentUser.email,
              orderId: orderId,
              destinationNames: destinationNames,
              tourDetails: tourDetails,
            }),
          });
          if (invoiceResponse.ok) {
            console.log("Invoice generated and sent successfully");
          } else {
            console.error("Failed to generate and send invoice");
          }
        },
        onPending: function (result) {
          // Handle pending
          console.log("Payment pending:", result);
        },
        onError: function (result) {
          // Handle error
          console.log("Payment error:", result);
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "An error occurred during payment. Please try again.",
          });
        },
        onClose: function () {
          // Handle close
          console.log("Payment popup closed");
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "An error occurred while placing your order. Please try again later.",
      });
    }
  };

  const formatDate = (dateString) => {
    const createdDate = new Date(dateString);
    const formattedDate = `${createdDate.getDate()}-${
      createdDate.getMonth() + 1
    }-${createdDate.getFullYear()}`;
    return formattedDate;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-green-800 dark:text-gray-100">
          Detail Paket - {tourDetails.nama_paket}
        </h1>
      </header>
      <section className="w-full max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <Image
          src={tourDetails?.picture}
          alt={`Trip ${tourDetails.nama_paket}`}
          width={600}
          height={256}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-gray-100 mb-4">
            Deskripsi
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-400">
            {tourDetails.deskripsi}
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-gray-100 mb-4">
            Harga Paket
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-400">
            {formatRupiah(tourDetails.harga)}
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-gray-100 mb-4">
            Destinasi
          </h2>
          <ul className="list-none ml-3 mt-2 flex flex-col gap-3">
            {destinationNames.length === 0 ? (
              <li className="text-gray-900 dark:text-gray-300">
                Tidak ada destinasi.
              </li>
            ) : (
              destinationNames.map((destination, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 text-gray-900 dark:text-gray-300 my-2"
                >
                  <div className="flex flex-row justify-between items-center w-full mr-4">
                    <div className="flex flex-row gap-1 justify-center items-center">
                      <svg
                        className="h-5 w-5 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2C8.134 2 5 5.134 5 9c0 6.627 7 13 7 13s7-6.373 7-13c0-3.866-3.134-7-7-7zM12 11a2 2 0 100-4 2 2 0 000 4z"
                        />
                      </svg>
                      <span>{destination.nama}</span>
                    </div>

                    <div>
                      <h1 className="font-semibold">
                        {formatRupiah(parseInt(destination.harga))}
                      </h1>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="mt-6 flex justify-center">
          {refId ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setId(refId);
                setRefId(null);
              }}
            >
              Restore
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleOpenModal}
            >
              Add Custom Destinations
            </button>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Select Destinations</h2>
              <ul className="mb-4">
                {destinations
                  .filter((dest) =>
                    tourDetails.nama_destinasi.includes(dest.id_destinasi)
                  )
                  .map((destination) => (
                    <li
                      key={destination.id_destinasi}
                      className="flex items-center mb-2"
                    >
                      <input
                        type="checkbox"
                        id={destination.id_destinasi}
                        checked={selectedCustomDestinations.includes(
                          destination.id_destinasi
                        )}
                        onChange={() =>
                          handleSelectDestination(destination.id_destinasi)
                        }
                        className="mr-2"
                      />
                      <label htmlFor={destination.id_destinasi}>
                        {destination.nama_destinasi}
                      </label>
                    </li>
                  ))}
              </ul>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSubmitCustomDestinations}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-gray-100 mb-4">
            Total Harga
          </h2>
          <p className="mt-2 text-xl font-bold text-green-800 dark:text-green-300">
            {formatRupiah(hargaTotal)}
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-gray-100 mb-4">
            Itinerary
          </h2>
          <div className="space-y-6">
            {tourDetails.itinerary.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <svg
                    className="h-10 w-10 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-gray-900 dark:text-gray-300">
                  <p className="font-semibold text-lg mb-2">{`Hari ${
                    index + 1
                  }`}</p>
                  <p className="whitespace-pre-line">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-gray-100 mb-4">
            Inclusion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tourDetails.inclusion.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-center space-x-4"
              >
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-gray-900 dark:text-gray-300">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-gray-100 mb-4">
            Exclusion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tourDetails.exclusion.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-center space-x-4"
              >
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="text-gray-900 dark:text-gray-300">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          {hasOrdered ? (
            <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
              Pesanan Sudah Dibuat
            </button>
          ) : (
            <button
              onClick={handleOrder}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Pesan Sekarang
            </button>
          )}
        </div>
        {hasOrdered && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-green-800 dark:text-gray-100 mb-4">
              Submit Your Review
            </h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <RenderStars rating={rating} onRatingChange={setRating} />
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Add a review"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
        {reviews?.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-green-800 dark:text-gray-100 mt-5">
              Reviews
            </h3>

            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id_review}
                  className="border border-gray-300 p-4 rounded-lg dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <h1 className="font-bold">
                      {review.nama} ({formatDate(review._created_date)})
                    </h1>
                    <RenderStars
                      rating={review.rating}
                      onRatingChange={() => {}}
                    />
                    {/* <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {review.rating}
                  </span> */}
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {review.deskripsi}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 mt-10">
            No reviews yet.
          </p>
        )}
      </section>
    </div>
  );
}

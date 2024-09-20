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

  const handleOrderWhatsApp = () => {
    const message = `Hallo, saya ingin konsultasi untuk pesan paket tour ini: ${tourDetails?.nama_paket}.`;
    const phoneNumber = "+6285338717747"; // Nomor WhatsApp admin
  
    // Membuka WhatsApp dengan pesan yang sudah di-encode
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(waLink, "_blank");
  };
  

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

    // if (currentUser) {
    //   fetch(`/api/check-order?user=${currentUser.id_user}&tour=${id}`)
    //     .then((res) => {
    //       if (!res.ok) {
    //         throw new Error("Failed to fetch order status");
    //       }
    //       return res.json();
    //     })
    //     .then(({ success }) => setHasOrdered(success))
    //     .catch((error) => {
    //       console.error("Error fetching order status:", error);
    //     });
    // }

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

  // const handleSelectDestination = (destinationId) => {
  //   setSelectedCustomDestinations((prevSelected) =>
  //     prevSelected.includes(destinationId)
  //       ? prevSelected.filter((id) => id !== destinationId)
  //       : [...prevSelected, destinationId]
  //   );
  // };

  // const handleSubmitCustomDestinations = async () => {
  //   const response = await fetch(`/api/paket-tour/${id}/custom`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ nama_destinasi: selectedCustomDestinations }),
  //   });

  //   const res = await response.json();
    
  //   if (response.ok) {
  //     const { id_tour } = res.data;
  //     Swal.fire({
  //       icon: "success",
  //       title: "Custom Destinations Added",
  //       text: "Your custom destinations have been added successfully.",
  //     });

  //     handleCloseModal();
  //     setRefId(id);
  //     setId(id_tour);
  //     // router.push(`/paket-tour/paket/${id_tour}`);
  //   } else {
  //     if(res.status === 401) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Unauthorized",
  //         text: "Harap Login terlebih dahulu.",
  //       });
  //       return;
  //     }
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed to Add Custom Destinations",
  //       text: "An error occurred while adding your custom destinations. Please try again.",
  //     });
  //   }
  // };

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

  // const handleSubmitReview = async (e) => {
  //   e.preventDefault();

  //   if (!orderId) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Order ID Missing",
  //       text: "Order ID is missing. Please complete the payment first.",
  //     });
  //     return;
  //   }

  //   const response = await fetch("/api/review", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       id_tour: id,
  //       id_order: orderId, // Ambil id_order yang relevan dari hasil validasi
  //       rating,
  //       deskripsi,
  //     }),
  //   });
  //   const addedRev = await response.json();
  //   const _addedRev = { ...addedRev, nama: currentUser.nama };

  //   if (response.ok) {
  //     // Refresh halaman atau tampilkan notifikasi sukses
  //     Swal.fire({
  //       icon: "success",
  //       title: "Review Submitted",
  //       text: "Thank you for your review!",
  //     });
  //     setRating("");
  //     setDeskripsi("");
  //     setHasOrdered(false);
  //     setReviews((prevReviews) => [...prevReviews, _addedRev]);
  //   } else {
  //     // Tampilkan pesan kesalahan jika gagal
  //     const error = await response.json();
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed to Submit Review",
  //       text: "An error occurred while submitting your review. Please try again later.",
  //     });
  //   }
  // };

  // const handleOrder = async () => {
  //   if (!currentUser) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Login Required",
  //       text: "Please login to place an order.",
  //     });
  //     return;
  //   }

  //   const orderData = {
  //     id_user: currentUser.id_user,
  //     id_tour: id,
  //     amount: hargaTotal,
  //     email: currentUser.email,
  //   };

  //   const response = await fetch("/api/payment", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(orderData),
  //   });

  //   if (response.ok) {
  //     const { token, orderId } = await response.json();
  //     setOrderId(orderId);
  //     window.snap.pay(token, {
  //       onSuccess: async function (result) {
  //         // Handle success
  //         console.log("Payment success:", result);
  //         Swal.fire({
  //           icon: "success",
  //           title: "Payment Successful",
  //           text: "Thank you for your order!",
  //         });
  //         setHasOrdered(true); // Setelah sukses order, ubah status `hasOrdered` menjadi true

  //         // Generate and send invoice
  //         const invoiceResponse = await fetch("/api/invoice", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             id_user: currentUser.id_user,
  //             id_tour: id,
  //             amount: hargaTotal,
  //             email: currentUser.email,
  //             orderId: orderId,
  //             destinationNames: destinationNames,
  //             tourDetails: tourDetails,
  //           }),
  //         });
  //         if (invoiceResponse.ok) {
  //           console.log("Invoice generated and sent successfully");
  //         } else {
  //           console.error("Failed to generate and send invoice");
  //         }
  //       },
  //       onPending: function (result) {
  //         // Handle pending
  //         console.log("Payment pending:", result);
  //       },
  //       onError: function (result) {
  //         // Handle error
  //         console.log("Payment error:", result);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Payment Failed",
  //           text: "An error occurred during payment. Please try again.",
  //         });
  //       },
  //       onClose: function () {
  //         // Handle close
  //         console.log("Payment popup closed");
  //       },
  //     });
  //   } else {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Order Failed",
  //       text: "An error occurred while placing your order. Please try again later.",
  //     });
  //   }
  // };

  // const formatDate = (dateString) => {
  //   const createdDate = new Date(dateString);
  //   const formattedDate = `${createdDate.getDate()}-${
  //     createdDate.getMonth() + 1
  //   }-${createdDate.getFullYear()}`;
  //   return formattedDate;
  // };

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
        {/* <div className="mt-6 flex justify-center">
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
        )} */}
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
              onClick={handleOrderWhatsApp}
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

"use client";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/utils/userContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export default function PaketTourDetail({ params }) {
  const [id, setId] = useState(params?.id);
  const [tourDetails, setTourDetails] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [hargaTotal, setHargaTotal] = useState(0);
  const router = useRouter();

  const handleOrderWhatsApp = () => {
    const message = `Hallo, saya ingin konsultasi untuk pesan paket tour ini: ${tourDetails?.nama_paket}.`;
    const phoneNumber = "+6285338717747";
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(waLink, "_blank");
  };

  useEffect(() => {
    fetch(`/api/paket-tour?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTourDetails(data?.data);
        setSelectedDestinations(data?.data?.nama_destinasi || []);
      })
      .catch((error) => {
        console.error("Error fetching tour details:", error);
      });

    fetch("/api/destinasi")
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data.data);
      })
      .catch((error) => {
        console.error("Error fetching destinations:", error);
      });
  }, [id]);

  useEffect(() => {
    calculateHargaTotal();
  }, [tourDetails]);

  const calculateHargaTotal = () => {
    const paketPrice = parseInt(tourDetails?.harga) || 0;
    const destinationTotalPrice = destinations
      .filter((dest) => tourDetails?.nama_destinasi.includes(dest.id_destinasi))
      .reduce((acc, curr) => acc + parseInt(curr.harga), 0);
    setHargaTotal(paketPrice + destinationTotalPrice);
  };

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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const destinationNames = selectedDestinations.map((destId) => {
    const destination = destinations.find((d) => d.id_destinasi === destId);
    return destination
      ? { nama: destination.nama_destinasi, harga: destination.harga }
      : "Unknown";
  });

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
                  <p className="font-semibold text-lg mb-2">{`Hari ${index + 1}`}</p>
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
        <div className="mt-6">
          <button
            onClick={handleOrderWhatsApp}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
          >
            Pesan Paket via WhatsApp
          </button>
        </div>
      </section>
      <a
        href="https://wa.me/6285338717747?text=Hallo%20Saya%20Ingin%20Berkonsultasi%20Untuk%20Paket%20Tour%20Di%20Lombok%20Travelia"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:bg-green-600 flex items-center"
        style={{ zIndex: 1000 }} // Agar berada di atas konten lain
      >
        <Image src="/images/wa-icon.svg" alt="WhatsApp" width={40} height={40} />
      </a>
    </div>
  );
}

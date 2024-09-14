"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    fetch(`/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => {
        if (response.ok) {
          fetch(`/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }).then((response) => {
            if (response.ok) router.push("/");
            else
              return response.json().then((data) => {
                throw new Error(data.message || "Unknown error occurred");
              });
          });
        } else
          return response.json().then((data) => {
            throw new Error(data.message || "Unknown error occurred");
          });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-4xl font-bold">Loading...</div>
        </div>
      )}
      <form className="w-full max-w-sm" onSubmit={handleSignUp}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nama Lengkap
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Masukkan Nama Lengkap"
            onChange={(e) => setName(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Masukkan Email"
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Masukkan Password"
            onChange={(e) => setPassword(e.target.value)}
            required={true}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Daftar
          </button>
          <Link href="/login" legacyBehavior>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Sudah punya akun? Login
            </a>
          </Link>
        </div>
        {/* <div className="mt-6">
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full"
          type="button"
        >
          <span className="mr-2">
            <img
              src="/path-to-google-icon.png"
              alt="Google"
              className="w-5 inline"
            />
          </span>
          Daftar dengan Google
        </button>
      </div> */}
      </form>
    </>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layout";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { storage } from "@/utils/firebaseConfig"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";

const EditPengguna = ({ params }) => {
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState({ nama: "", email: "", picture_url: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/users?id_user=${params?.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data?.users[0]);
      });
  }, [params]);

  const uploadImage = async () => {
    if (!file) return; // If no file selected, return

    const fileRef = ref(storage, `users/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploading(true);
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
          setUploading(false);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUser((prevState) => ({
              ...prevState,
              picture_url: downloadURL,
            }));
            setUploading(false);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload image first if a new file is selected
    if (file) {
      try {
        await uploadImage();
      } catch (error) {
        setLoading(false);
        return;
      }
    }

    const updateData = {
      name: user?.nama,
      email: user?.email,
      id_user: params?.id,
      picture_url: user?.picture_url, // Use the uploaded image URL
    };

    fetch(`/api/users`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then(({ message }) => {
            Swal.fire({
              title: "Updated!",
              text: message,
              icon: "success",
            });
            router.push("/admin/pengguna");
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    try {
      await uploadImage();
      Swal.fire({
        title: "Image Uploaded!",
        text: "Your image has been successfully uploaded.",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-4xl font-bold text-color-primary">Loading...</div>
        </div>
      )}
      <AdminLayout showSidebar={true}>
        <h1 className="text-2xl font-bold mb-4">Edit Profil</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2">Nama</label>
            <input
              type="text"
              name="nama"
              value={user.nama}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>
          <div>
            <label className="block mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />
            <button
              type="button"
              onClick={handleUploadClick}
              className="bg-green-500 text-white p-2 rounded mb-4"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            {user.picture_url && (
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={user.picture_url}
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Update Profil"}
          </button>
        </form>
      </AdminLayout>
    </>
  );
};

export default EditPengguna;

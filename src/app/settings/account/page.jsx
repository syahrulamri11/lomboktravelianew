"use client";
import { storage } from "@/utils/firebaseConfig";
import { UserContext } from "@/utils/userContext";
import { Button, Card, Image, Input, Spinner } from "@nextui-org/react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useContext, useRef, useState } from "react";
import Swal from "sweetalert2";

const Account = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const handleSubmit = async (e) => {
    setLoading(true);
    fetch(`/api/users`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || currentUser?.nama,
        email: email || currentUser?.email,
        id_user: currentUser?.id_user,
      }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then(({ message }) => {
            setCurrentUser((prevState) => ({
              ...prevState,
              ["nama"]: name || currentUser?.nama,
              ["email"]: email || currentUser?.email,
            }));
            Swal.fire({
              title: "Updated!",
              text: message,
              icon: "success",
            });
          });
        }
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
  const handleImageUpload = async (e) => {
    console.log("Uploading image");
    const file = e.target.files[0];
    if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Format File Salah: .jpg .jpeg .png .gif",
      });
      return;
    }
    const storageRef = ref(storage, `users/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setIsUploading(true);
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error?.message,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          fetch(`/api/users/picture`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              picture_url: downloadURL,
              id_user: currentUser?.id_user,
            }),
          }).then((res) => {
            if (res.ok) {
              Swal.fire({
                title: "Updated!",
                text: "Image uploaded successfully",
                icon: "success",
              });
              setCurrentUser((prevState) => ({
                ...prevState,
                ["picture_url"]: downloadURL,
              }));
              setIsUploading(false);

              // Deleting user old picture
              if (currentUser.picture_url) {
                const firebaseStoragePattern =
                  /firebasestorage\.googleapis\.com/;
                if (firebaseStoragePattern.test(currentUser.picture_url)) {
                  const oldPicture = ref(storage, currentUser?.picture_url);
                  deleteObject(oldPicture);
                }
              }
            }
          });
        });
      }
    );
  };
  if (!currentUser)
    return (
      <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
        <Spinner
          style={{ borderTopColor: "#35D235", borderRightColor: "#35D235" }}
        />
      </div>
    );
  return (
    <Card className="p-4 flex flex-col md:flex-row justify-center">
      <Card className="md:w-1/3 p-4 mx-auto">
        <Image
          width={300}
          height={300}
          src={
            currentUser?.picture_url || "https://via.placeholder.com/300x300"
          }
          alt="User's Profile Picture"
          className="mb-4"
          radius="sm"
        />
        <input
          ref={fileInputRef}
          type="file"
          name="picture"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          color="success"
          radius="sm"
          onPress={() => fileInputRef.current.click()}
          isLoading={isUploading}
        >
          Pilih Gambar
        </Button>
      </Card>
      <div className="md:w-2/3 px-4">
        <Input
          isRequired
          type="text"
          label="Name"
          value={name || currentUser?.nama}
          className="w-full mb-4"
          onValueChange={(value) => {
            setName(value);
            setIsChanged(true);
          }}
        />
        <Input
          isRequired
          type="email"
          label="Email"
          value={email || currentUser?.email}
          className="w-full mb-4"
          onValueChange={(value) => {
            setEmail(value);
            setIsChanged(true);
          }}
        />
        <div className="flex justify-end gap-4">
          <Button
            color="default"
            radius="sm"
            isDisabled={!isChanged || isLoading}
            onPress={() => {
              setName(currentUser?.nama);
              setEmail(currentUser?.email);
              setIsChanged(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="success"
            radius="sm"
            onPress={handleSubmit}
            isDisabled={!isChanged}
            isLoading={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Account;
import Image from "next/image";
import { SignUpForm } from "@/components/signUpForm";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="w-1/2 hidden md:block relative">
          <Image
            src="/images/login.png"
            alt="Lombok Travelia"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-semibold mb-6">Buat Akun Baru</h1>
          <p className="text-lg mb-10">Bergabunglah dengan Lombok Travelia</p>
          <SignUpForm/>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

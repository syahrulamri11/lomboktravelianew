import Image from 'next/image';
import { LoginForm } from '@/components/loginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="w-1/2 hidden md:block relative">
          <Image src="/images/login.png" alt="Lombok Travelia" layout="fill" objectFit="cover" className="rounded-t-xl" />
           {/* <div className="absolute inset-0 flex justify-center items-center">
            <div className="bg-white bg-opacity-75 p-4 rounded-md shadow-lg">
              <h2 className="text-xl font-semibold">admin@gmail.com</h2>
              <p>password: admin</p>
            </div> 
          </div> */}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-semibold mb-6">Selamat Datang</h1>
          <p className="text-lg mb-10">Selamat Datang di Lombok Travelia</p>
          <LoginForm/>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import Image from 'next/image';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="w-1/2 hidden md:block relative">
          <Image src="/images/login.png" alt="Lombok Travelia" layout="fill" objectFit="cover" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-semibold mb-6">Selamat Datang</h1>
          <p className="text-lg mb-10">Selamat Datang di Lombok Travelia</p>
          <form className="w-full max-w-sm">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Masukkan Email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Masukkan Password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Login
              </button>
              <Link href="/sign-up" legacyBehavior>
                <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                  Daftar
                </a>
              </Link>
            </div>
            <div className="mt-6">
              <button
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full"
                type="button"
              >
                <span className="mr-2">
                  <img src="/path-to-google-icon.png" alt="Google" className="w-5 inline" />
                </span>
                Login with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

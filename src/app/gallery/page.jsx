import Image from 'next/image';
import Link from 'next/link';

export default function Gallery() {
  return (
    <div>
      <section className="text-center py-20 bg-gray-100">
        <div className="flex flex-col mx-auto justify-center items-center text-black">
          <h2 className="text-4xl font-bold mb-8">GALERI</h2>
          <h3 className="text-2xl mb-4">Lombok Travelia</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5 w-full max-w-[1450px]">
            <div className='h-[300px] flex justify-center items-center rounded-lg shadow-md'> 
              <Image src="/images/wisata-1.jpeg" alt="Foto Wisata 2" width={400} height={300} className="rounded-lg object-cover h-full w-full" />
            </div>
            <div className='h-[300px] flex justify-center items-center rounded-lg shadow-md'>
              <Image src="/images/wisata-2.jpeg"  alt="Foto Wisata 2" width={400} height={300} className="rounded-lg object-cover h-full w-full" />
            </div>
            <div className='h-[300px] flex justify-center items-center rounded-lg shadow-md'>
              <Image src="/images/wisata-1.jpeg" alt="Foto Wisata 3" width={400} height={300} className="rounded-lg object-cover h-full w-full" />
            </div>
            <div className='h-[300px] flex justify-center items-center rounded-lg shadow-md'>
              <Image src="/images/wisata-1.jpeg" alt="Foto Wisata 4" width={400} height={300} className="rounded-lg object-cover h-full w-full" />
            </div>
            <div className="bg-gray-200 rounded-lg shadow-md flex items-center justify-center text-gray-600 h-[300px]">
              Foto Wisata
            </div>
            <div className="bg-gray-200 rounded-lg shadow-md flex items-center justify-center text-gray-600 h-[300px]">
              Foto Wisata lainnya
            </div>
          </div>
          <div className="mt-8">
            <Link href="/gallery?page=2" className="text-blue-600">1 2 Berikutnya</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

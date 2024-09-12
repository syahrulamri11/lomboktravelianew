import Link from 'next/link';

export default function ContactUs() {
  return (
    <div>
      <section className="text-center py-20 bg-gray-100 text-black">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Hubungi Kami</h2>
          <h3 className="text-2xl mb-4">Sistem Pemesanan Dan Pembayaran</h3>
          <ul className="text-left list-decimal list-inside mb-8">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie non elit non vestibulum.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie non elit non vestibulum.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie non elit non vestibulum.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie non elit non vestibulum.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie non elit non vestibulum.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie non elit non vestibulum.</li>
          </ul>
          <p className="text-left mb-4">Catatan Penting:</p>
          <button className="bg-green-600 text-white px-6 py-3 rounded mb-8">Hubungi Kami</button>
          <h3 className="text-2xl mb-4">Alamat</h3>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Link href="https://www.facebook.com/yourpage" className="text-blue-600">Facebook</Link>
            <Link href="https://wa.me/your-whatsapp-number" className="text-green-600">WhatsApp</Link>
            <Link href="https://www.instagram.com/yourprofile" className="text-pink-600">Instagram</Link>
            <Link href="mailto:your-email@example.com" className="text-red-600">Email</Link>
          </div>
          <div className="flex justify-center">
            <iframe 
              src="https://www.google.com/maps/embed?pb=your-map-embed-code"
              width="600"
              height="450"
              style={{border:0}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

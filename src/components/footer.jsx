const Footer = () => {
  return (
    <footer className="px-2">
      <div className="bg-gray-900 text-white py-8 px-10 rounded-t-xl">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold mb-4">LOGO LOMBOK TRAVELIA</h3>
          <p>&copy; 2024 Lombok Travelia ltd. All rights reserved</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <a href="https://www.facebook.com/syahrulamri" target="_blank" rel="noopener noreferrer">
              <img src="assets/images/facebook-icon.svg" alt="Facebook" className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/syahrul11_amri" target="_blank" rel="noopener noreferrer">
              <img src="assets/images/instagram-icon.svg" alt="Instagram" className="w-6 h-6" />
            </a>
            <a href="https://wa.me/83143052787" target="_blank" rel="noopener noreferrer">
              <img src="assets/images/whatsapp-icon.svg" alt="WhatsApp" className="w-6 h-6" />
            </a>
            <a href="https://twitter.com/dicoding" target="_blank" rel="noopener noreferrer">
              <img src="assets/images/twitter-icon.svg" alt="Twitter" className="w-6 h-6" />
            </a>
            <a href="mailto:your-email@example.com" target="_blank" rel="noopener noreferrer">
              <img src="assets/images/email-icon.svg" alt="Email" className="w-6 h-6" />
            </a>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold mb-4">Main Menu</h3>
          <ul>
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/paket-tour" className="hover:underline">Paket Tour</a></li>
            <li><a href="/destinasi" className="hover:underline">Destinasi</a></li>
            <li><a href="/gallery" className="hover:underline">Gallery</a></li>
            <li><a href="/contact-us" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold mb-4">Destinasi</h3>
          <ul>
            <li><a href="#" className="hover:underline">Wisata Pantai</a></li>
            <li><a href="#" className="hover:underline">Wisata Desa & Air Terjun</a></li>
            <li><a href="#" className="hover:underline">Wisata Budaya</a></li>
            <li><a href="#" className="hover:underline">Wisata Kuliner</a></li>
          </ul>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
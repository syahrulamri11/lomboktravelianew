import Header from "../components/header";
import Footer from "../components/footer";
import "./globals.css";

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Lombok Travelia</title>
        <meta
          name="description"
          content="Explore Lombok with Lombok Travelia"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Header />
        <div className="container">
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default Layout;

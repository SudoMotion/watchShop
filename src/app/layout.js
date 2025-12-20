import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Watch Shop BD: No.1 Watch Retailer for Luxury Watch Brands | Watch Shop BD ",
  description: "Watch Shop BD - Trusted for authentic luxury watches in Bangladesh. Explore brands like Rado",
  keyword: "&quot;watch, ladies watch, watch brands, seiko watch price in bangladesh, watch price in bd, watch shop"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <div className="flex flex-col justify-between min-h-screen text-xs md:text-sm">
          <Header />
          <div className="flex-1 w-full">
            {children}
          </div>
          <Footer/>
        </div>
      </body>
    </html>
  );
}

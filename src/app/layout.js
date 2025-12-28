import { Jost } from "next/font/google";
import "./globals.css";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata = {
  title: "Watch Shop BD: No.1 Watch Retailer for Luxury Watch Brands | Watch Shop BD ",
  description: "Watch Shop BD - Trusted for authentic luxury watches in Bangladesh. Explore brands like Rado",
  keyword: "&quot;watch, ladies watch, watch brands, seiko watch price in bangladesh, watch price in bd, watch shop"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jost.variable}>
      <body className="font-sans antialiased">
        <div className="flex flex-col justify-between min-h-screen text-xs md:text-sm">
          <Header />
          <div className="flex-1 w-full pt-[75px]">
            {children}
          </div>
          <Footer/>
        </div>
      </body>
    </html>
  );
}

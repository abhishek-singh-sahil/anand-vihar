import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
//   Facebook,
//   Instagram,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Offers", path: "/offers" },
    { name: "Gallery", path: "/gallery" },
    { name: "Reservation", path: "/reservation" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-[#013e37] text-white mt-20">

      {/* Top */}

      <div className="section py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">

          {/* Company */}

          <div>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-full bg-[#ff9248] flex items-center justify-center text-3xl font-bold">

                A

              </div>

              <div>

                <h2 className="text-2xl font-bold">

                  Anand Vihar

                </h2>

                <p className="text-[#ffefb3]">

                  Restaurant & Sweet Shop

                </p>

              </div>

            </div>

            <p className="mt-6 leading-8 text-gray-300">

              Enjoyment hua band, toh khao Kalakand!
              Serving delicious sweets and mouth-watering
              food with premium quality and unforgettable taste.

            </p>

            <div className="flex gap-4 mt-8">

              <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#ff9248] transition flex items-center justify-center">

                {/* <Facebook size={18} /> */}

              </button>

              <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#ff9248] transition flex items-center justify-center">

                {/* <Instagram size={18} /> */}

              </button>

              <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#ff9248] transition flex items-center justify-center">

                {/* <MessageCircle size={18} /> */}

              </button>

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Quick Links

            </h3>

            <div className="space-y-4">

              {quickLinks.map((item) => (

                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-2 text-gray-300 hover:text-[#ff9248] transition"
                >

                  <ChevronRight size={16} />

                  {item.name}

                </Link>

              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Contact

            </h3>

            <div className="space-y-6">

              <div className="flex gap-3">

                <Phone className="text-[#ff9248] mt-1" size={18} />

                <span className="text-gray-300">

                  +91 9934190109

                </span>

              </div>

              <div className="flex gap-3">

                <Mail className="text-[#ff9248] mt-1" size={18} />

                <span className="text-gray-300">

                  info@anandvihar.com

                </span>

              </div>

              <div className="flex gap-3">

                <MapPin className="text-[#ff9248] mt-1 shrink-0" size={18} />

                <span className="text-gray-300 leading-7">

                  Anand Vihar Complex,
                  Near Jhanda Chowk,
                  Ranchi Patna Road,
                  Jhumri Telaiya,
                  Jharkhand - 825409

                </span>

              </div>

            </div>

          </div>

          {/* Timing */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Opening Hours

            </h3>

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <Clock className="text-[#ff9248]" size={18} />

                <span className="text-gray-300">

                  Monday - Sunday

                </span>

              </div>

              <div className="bg-white/10 rounded-2xl p-5">

                <p className="text-lg font-semibold">

                  8:00 AM

                </p>

                <p className="text-[#ffefb3]">

                  to

                </p>

                <p className="text-lg font-semibold">

                  10:30 PM

                </p>

              </div>

              <Link
                to="/reservation"
                className="block text-center orange-gradient rounded-xl py-3 font-semibold"
              >
                Reserve Table
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-white/10">

        <div className="section py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-400 text-center md:text-left">

            © {new Date().getFullYear()} Anand Vihar Restaurant & Sweet Shop.
            All Rights Reserved.

          </p>

          <div className="flex gap-6 text-sm text-gray-400">

            <Link to="/">Privacy Policy</Link>

            <Link to="/">Terms & Conditions</Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
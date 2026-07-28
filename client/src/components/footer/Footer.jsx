import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

function Footer() {
  const { settings } = useAuth();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Offers", path: "/offers" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-[#013e37] text-white mt-20 font-sans">
      {/* Top */}
      <div className="section py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
          
          {/* Company */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#ff9248] flex items-center justify-center text-3xl font-bold text-white shadow-md">
                A
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Anand Vihar</h2>
                <p className="text-[#ffefb3] text-sm font-semibold">Sweet Shop & Confectionery</p>
              </div>
            </div>

            <p className="leading-8 text-gray-300 text-sm">
              Enjoyment hua band, toh khao Kalakand! Serving Jhumri Telaiya’s favorite traditional sweets, premium ghee treats, and custom gifting packs since 1998.
            </p>

            {/* Social Logos */}
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#ff9248] hover:text-white text-white transition flex items-center justify-center cursor-pointer border border-transparent hover:border-white/20"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#ff9248] hover:text-white text-white transition flex items-center justify-center cursor-pointer border border-transparent hover:border-white/20"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://wa.me/919934190109" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#ff9248] hover:text-white text-white transition flex items-center justify-center cursor-pointer border border-transparent hover:border-white/20"
                aria-label="Whatsapp"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <div className="space-y-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-2 text-gray-300 hover:text-[#ff9248] transition text-sm font-medium"
                >
                  <ChevronRight size={14} className="text-gray-400" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">
              Contact Us
            </h3>
            <div className="space-y-6 text-sm">
              <div className="flex gap-3">
                <Phone className="text-[#ff9248] mt-0.5" size={18} />
                <span className="text-gray-300 font-medium">+91 9934190109</span>
              </div>

              <div className="flex gap-3">
                <Mail className="text-[#ff9248] mt-0.5" size={18} />
                <span className="text-gray-300 font-medium">info@anandvihar.com</span>
              </div>

              <div className="flex gap-3">
                <MapPin className="text-[#ff9248] mt-0.5 shrink-0" size={18} />
                <span className="text-gray-300 leading-7">
                  Anand Vihar Complex,<br />
                  Near Jhanda Chowk, HDFC Bank,<br />
                  Jhumri Telaiya, Koderma,<br />
                  Jharkhand - 825409
                </span>
              </div>
            </div>
          </div>

          {/* Timing & Operations */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">
              Opening Hours
            </h3>
            <div className="space-y-5 text-sm">
              <div className="flex items-center gap-3">
                <Clock className="text-[#ff9248]" size={18} />
                <span className="text-gray-300 font-medium">Monday - Sunday</span>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 border border-white/5">
                <p className="text-lg text-orange-500 font-bold">8:00 AM</p>
                <p className="text-[#ffefb3] my-1 text-xs uppercase font-bold tracking-widest">to</p>
                <p className="text-lg text-orange-500 font-bold">10:30 PM</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="section py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Anand Vihar Sweet Shop & Confectionery. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link to="/privacy-policy" className="hover:text-[#ff9248] transition">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-[#ff9248] transition">Terms & Conditions</Link>
            <Link to="/faq" className="hover:text-[#ff9248] transition">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
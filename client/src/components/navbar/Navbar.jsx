import React, { useState, useEffect, useRef } from 'react'
import logo from '../../assets/logo/logo.png'
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaUser,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaSignOutAlt,
  FaLock,
  FaShoppingBag
} from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logoutUser, settings } = useAuth()
  const { getCartCount } = useCart()
  
  // Track scroll position to dynamically collapse announcement bar
  const [scrolled, setScrolled] = useState(false)
  
  // Track the actual current window path to keep the line indicator accurate
  const [currentPath, setCurrentPath] = useState('/')
  const dropdownRef = useRef(null)

  const navLinks = [
    { name: 'Home', link: '/' },
    { name: 'Menu', link: '/menu'},
    { name: 'Gallery', link: '/gallery' },
    { name: 'Testimonials', link: '/testimonials' },
    { name: 'Blogs', link: '/blogs' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' }
  ]

  // Track scroll position with a lock timer to prevent vibrating loops due to layout shift
  const lastToggleTime = useRef(0)
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      const now = Date.now()
      
      // Prevent state changes more than once every 500ms
      if (now - lastToggleTime.current < 500) return

      if (currentScroll > 60 && !scrolled) {
        setScrolled(true)
        lastToggleTime.current = now
      } else if (currentScroll <= 60 && scrolled) {
        setScrolled(false)
        lastToggleTime.current = now
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  // Automatically sync active tab underline with the real browser location URL path
  useEffect(() => {
    setCurrentPath(window.location.pathname)

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  // Close desktop dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLinkClick = () => {
    setMenuOpen(false)
    setDropdownOpen(false)
    setTimeout(() => {
      setCurrentPath(window.location.pathname)
    }, 50)
  }

  const handleLogout = async () => {
    await logoutUser()
    handleLinkClick()
  }

  return (
    <div className="w-full bg-white font-sans sticky top-0 z-[999] shadow-md transition-all duration-300">
      {/* ================= TOP ANNOUNCEMENT BAR (NOT sticky, collapses on scroll) ================= */}
      <div className={`hidden lg:block w-full bg-[#002c1a] text-white transition-all duration-300 ease-in-out overflow-hidden ${
        scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
      }`}>
        <div className='w-full max-w-[1440px] mx-auto h-11 px-8 flex items-center justify-between font-sans text-[13px]'>
          
          {/* Contact Actions */}
          <div className='flex items-center gap-6 text-white/90'>
            <a href="tel:+919934190109" className='flex items-center gap-1.5 hover:text-[#ff6b1a] transition-colors'>
              <FaPhoneAlt className='text-[#ff6b1a] text-[11px]' />
              <span>+91 9934190109</span>
            </a>
            <a 
              href="https://maps.google.com/?q=Anand+Vihar+Complex+Near+Jhanda+Chowk" 
              target="_blank" 
              rel="noopener noreferrer" 
              className='flex items-center gap-2 hover:text-[#ff6b1a] transition-colors'
            >
              <FaMapMarkerAlt className='text-[#ff6b1a] text-[12px]' />
              <span>Anand Vihar Complex, Near Jhanda Chowk</span>
            </a>
          </div>

          {/* Tagline Announcement (Stylish text instead of plain text) */}
          <div className='font-extrabold italic tracking-wider bg-gradient-to-r from-white via-[#ffd066] to-white bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] animate-pulse'>
            ✦ Enjoyment hua band ? ...toh khao Kalakand! ✦
          </div>

          {/* Social Profiles */}
          <div className='flex items-center gap-4 text-sm text-white/90'>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className='hover:text-[#ff6b1a] transition-colors' aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className='hover:text-[#ff6b1a] transition-colors' aria-label="Instagram"><FaInstagram /></a>
            <a href="https://wa.me/919934190109" target="_blank" rel="noopener noreferrer" className='hover:text-[#ff6b1a] transition-colors' aria-label="Whatsapp"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER NAVIGATION ================= */}
      <nav className="w-full bg-white/95 backdrop-blur-md rounded-b-3xl transition-all duration-300">
        <div className={`w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? 'h-16 lg:h-20' : 'h-20 lg:h-24'
        }`}>
          
          {/* Brand Logo Anchor */}
          <a href="/" onClick={handleLinkClick} className='flex items-center justify-start flex-shrink-0 py-2'>
            <img
              src={logo}
              alt='Anand Vihar'
              className='h-10 sm:h-12 lg:h-14 w-auto object-contain block'
            />
          </a>

          {/* Desktop Navigation Link Group */}
          <div className='hidden lg:flex items-center justify-center flex-grow'>
            <ul className='flex items-center gap-6 xl:gap-8 m-0 p-0 list-none relative h-full'>
              {navLinks.map((item, index) => {
                const isItemActive = currentPath === item.link || (item.link !== '/' && currentPath.startsWith(item.link))

                return (
                  <li 
                    key={index} 
                    className='relative py-2 flex flex-col items-center justify-center'
                  >
                    <a
                      href={item.link}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-1.5 font-sans font-semibold text-[14px] xl:text-[15px] transition-colors duration-200 pb-1 ${
                        isItemActive ? 'text-[#ff6b1a]' : 'text-gray-800 hover:text-[#ff6b1a]'
                      }`}
                    >
                      <span>{item.name}</span>
                    </a>

                    {/* Dynamic Active Underline */}
                    {isItemActive && (
                      <span className='absolute bottom-[-4px] left-0 w-full h-[2.5px] bg-[#ff6b1a] rounded-full transition-all duration-200' />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Right Action Container Blocks */}
          <div className='hidden lg:flex items-center gap-5 xl:gap-6 flex-shrink-0'>
            {/* Dynamic Admin Panel link */}
            {isAuthenticated && isAdmin && (
              <a 
                href="/admin/dashboard"
                onClick={handleLinkClick}
                className='flex items-center gap-1.5 font-sans font-semibold text-[#013e37] hover:text-[#ff6b1a] transition-colors text-[14px] xl:text-[15px] cursor-pointer'
              >
                <FaLock size={13} />
                <span>Admin</span>
              </a>
            )}

            {/* Dynamic Cart Icon Link (visible only if ordering is enabled) */}
            {settings?.orderingEnabled && (
              <a 
                href="/cart"
                onClick={handleLinkClick}
                className='relative cursor-pointer text-gray-800 hover:text-[#ff6b1a] transition-colors p-1 flex items-center justify-center'
                title="View Shopping Cart"
              >
                <FaShoppingBag size={18} />
                <span className='absolute -top-1.5 -right-1.5 bg-[#ff6b1a] text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold shadow-sm animate-bounce'>
                  {getCartCount()}
                </span>
              </a>
            )}

            {/* Dynamic Auth profile link / login redirection */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <a 
                  href="/profile"
                  onClick={handleLinkClick}
                  className='flex items-center gap-2 font-sans font-semibold text-gray-800 hover:text-[#ff6b1a] transition-colors text-[14px] xl:text-[15px] cursor-pointer'
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center font-bold text-sm text-[#ff6b1a]">
                    {user?.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name.charAt(0)
                    )}
                  </div>
                  <span>{user?.name.split(" ")[0]}</span>
                </a>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                  title="Logout"
                >
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            ) : (
              <a 
                href="/login"
                onClick={handleLinkClick}
                className='flex items-center gap-2 font-sans font-semibold text-gray-800 hover:text-[#ff6b1a] transition-colors text-[14px] xl:text-[15px] cursor-pointer'
              >
                <FaUser size={14} className='text-gray-700' />
                <span>Login</span>
              </a>
            )}
          </div>

          {/* Mobile UI Action Layer */}
          <div className='flex items-center gap-3 lg:hidden flex-shrink-0'>
            {settings?.orderingEnabled && (
              <a 
                href="/cart"
                onClick={handleLinkClick}
                className='relative cursor-pointer text-gray-800 p-1.5 flex items-center justify-center mr-2'
              >
                <FaShoppingBag size={20} />
                <span className='absolute top-0 right-0 bg-[#ff6b1a] text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold shadow-sm'>
                  {getCartCount()}
                </span>
              </a>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className='p-1.5 text-2xl text-gray-800 focus:outline-none bg-transparent border-none cursor-pointer flex items-center justify-center'
              aria-label="Toggle Menu"
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Panel */}
        <div
          className={`lg:hidden w-full absolute top-20 left-0 bg-white border-t border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out z-40 ${
            menuOpen ? 'max-h-[100vh] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className='px-5 py-6 space-y-1 flex flex-col font-sans'>
            {navLinks.map((item, index) => {
              const isItemActive = currentPath === item.link || (item.link !== '/' && currentPath.startsWith(item.link))

              return (
                <a
                  key={index}
                  href={item.link}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between py-3 px-4 rounded-lg text-[15px] font-semibold text-gray-800 hover:bg-gray-55 hover:text-[#ff6b1a] ${
                    isItemActive ? 'bg-orange-50 text-[#ff6b1a]' : ''
                  }`}
                >
                  <span>{item.name}</span>
                </a>
              )
            })}

            <hr className='my-4 border-gray-100' />

            <div className='pt-2 space-y-3'>
              {isAuthenticated && isAdmin && (
                <a 
                  href="/admin/dashboard"
                  onClick={handleLinkClick}
                  className='flex items-center justify-center gap-2 w-full py-3.5 bg-orange-50/50 rounded-xl font-semibold text-[#013e37] hover:bg-orange-50 transition-colors text-center no-underline text-sm'
                >
                  <FaLock size={12} />
                  <span>Admin Dashboard</span>
                </a>
              )}

              {isAuthenticated ? (
                <>
                  <a 
                    href="/profile"
                    onClick={handleLinkClick}
                    className='flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl font-semibold text-gray-800 hover:bg-gray-55 transition-colors text-center no-underline text-sm'
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-xs font-bold text-[#ff6b1a]">
                      {user?.profilePic ? (
                        <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name.charAt(0)
                      )}
                    </div>
                    <span>My Profile ({user?.name.split(" ")[0]})</span>
                  </a>

                  <button 
                    onClick={handleLogout}
                    className='w-full py-3.5 border border-red-200 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-colors text-center cursor-pointer text-sm bg-white'
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <a 
                  href="/login"
                  onClick={handleLinkClick}
                  className='flex items-center justify-center gap-2 w-full py-3.5 border border-gray-200 rounded-xl font-semibold text-gray-800 hover:bg-gray-55 transition-colors text-center no-underline text-sm'
                >
                  <FaUser size={13} />
                  <span>Login / Register</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
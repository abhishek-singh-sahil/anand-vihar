import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Img1 from "../../assets/images/gallery1.jpg";
import Img2 from "../../assets/images/gallery2.jpg";
import Img3 from "../../assets/images/gallery3.jpg";
import Img4 from "../../assets/images/gallery4.jpg";
import Img5 from "../../assets/images/gallery5.jpg";
import Img6 from "../../assets/images/gallery6.jpg";

const images = [
  Img1,
  Img2,
  Img3,
  Img4,
  Img5,
  Img6,
];

function GalleryPreview() {
  return (
    <section className="py-12 bg-[var(--bg-main)]">
      <div className="section">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >

          <span className="inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37]">

            Gallery

          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-[#013e37]">

            A Glimpse of Our Delicious World

          </h2>

          <p className="mt-6 leading-8 text-slate-600">

            Every sweet, every dish and every corner of Anand Vihar
            reflects quality, freshness and the warmth of our hospitality.

          </p>

        </motion.div>

        {/* Gallery Grid */}

        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:grid-rows-2">

          {images.map((image, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: .9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * .08,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.04,
              }}
              className={`
                overflow-hidden rounded-[28px] shadow-premium cursor-pointer
                ${
                  index === 0
                    ? "lg:col-span-2 lg:row-span-2"
                    : ""
                }
              `}
            >

              <img
                src={image}
                alt="Gallery"
                className="h-full w-full object-cover transition duration-500 hover:scale-110"
              />

            </motion.div>

          ))}

        </div>

        {/* CTA */}

        <div className="mt-10 text-center">

          <Link
            to="/gallery"
            className="inline-flex items-center gap-3 rounded-full orange-gradient px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-105"
          >

            View Complete Gallery

            <ArrowRight size={20} />

          </Link>

        </div>

      </div>

    </section>
  );
}

export default GalleryPreview;
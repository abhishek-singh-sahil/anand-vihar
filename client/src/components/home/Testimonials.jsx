import { motion } from "framer-motion";
import { Star } from "lucide-react";

import Customer1 from "../../assets/images/customer1.jpg";
import Customer2 from "../../assets/images/customer2.jpg";
import Customer3 from "../../assets/images/customer3.jpg";

const testimonials = [
  {
    id: 1,
    name: "Rahul Kumar",
    image: Customer1,
    rating: 5,
    review:
      "The sweets are incredibly fresh and the restaurant food is absolutely delicious. Their hospitality is outstanding. Highly recommended!",
  },
  {
    id: 2,
    name: "Priya Sharma",
    image: Customer2,
    rating: 5,
    review:
      "One of the best sweet shops in Jhumri Telaiya. The ambience, taste and service make every visit memorable.",
  },
  {
    id: 3,
    name: "Amit Singh",
    image: Customer3,
    rating: 5,
    review:
      "Excellent quality, affordable prices and a wonderful family atmosphere. Their Kalakand is my absolute favourite.",
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-[var(--bg-section)]">

      <div className="section">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >

          <span className="inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37]">

            Testimonials

          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-[#013e37]">

            What Our Customers Say

          </h2>

          <p className="mt-6 leading-8 text-slate-600">

            The love and trust of our customers inspire us every day
            to serve delicious food and authentic sweets.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {testimonials.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="rounded-3xl bg-white p-8 shadow-premium"
            >

              <div className="flex items-center gap-5">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-full object-cover border-4 border-[#ff9248]"
                />

                <div>

                  <h3 className="text-xl font-bold text-[#013e37]">
                    {item.name}
                  </h3>

                  <div className="mt-2 flex gap-1">

                    {[...Array(item.rating)].map((_, i) => (

                      <Star
                        key={i}
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />

                    ))}

                  </div>

                </div>

              </div>

              <p className="mt-8 leading-8 italic text-slate-600">

                "{item.review}"

              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Testimonials;
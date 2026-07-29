import React from "react";
import Hero from "../../components/home/Hero";
import StatsBanner from "../../components/home/StatsBanner";
import Categories from "../../components/home/Categories";
import FeaturedSweets from "../../components/home/FeaturedSweets";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Stats from "../../components/home/Stats";
import GalleryPreview from "../../components/home/GalleryPreview";
import Testimonials from "../../components/home/Testimonials";
import Newsletter from "../../components/home/Newsletter";
import { useAuth } from "../../hooks/useAuth";

function Home() {
  const { settings } = useAuth();

  return (
    <>
      <Hero />
      <StatsBanner />
      <Categories />

      <FeaturedSweets />

      <WhyChooseUs />

      <Stats />
      <GalleryPreview />

      <Testimonials />

      <Newsletter />
    </>
  );
}

export default Home;
import React from "react";
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import FeaturedSweets from "../../components/home/FeaturedSweets";
import RestaurantSpecials from "../../components/home/RestaurantSpecials";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Stats from "../../components/home/Stats";
import Offers from "../../components/home/Offers";
import GalleryPreview from "../../components/home/GalleryPreview";
import Testimonials from "../../components/home/Testimonials";
import ReservationCTA from "../../components/home/ReservationCTA";
import Newsletter from "../../components/home/Newsletter";
import { useAuth } from "../../hooks/useAuth";

function Home() {
  const { settings } = useAuth();

  return (
    <>
      <Hero />

      <Categories />

      <FeaturedSweets />

      {settings?.reservationsEnabled && <RestaurantSpecials />}

      <WhyChooseUs />

      <Stats />

      <Offers />

      <GalleryPreview />

      <Testimonials />

      {settings?.reservationsEnabled && <ReservationCTA />}

      <Newsletter />
    </>
  );
}

export default Home;
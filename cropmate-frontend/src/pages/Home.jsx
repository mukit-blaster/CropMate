import React, { useEffect } from 'react';
import Banner from '../components/Banner';
import HowWorks from '../components/HowWorks';
import OurServices from '../components/OurServices';
import DeliveryFeatures from '../components/DeliveryFeatures';
import Motive from '../components/Motive';
import FAQSection from '../components/FAQSection';
import Testimonials from '../components/Testimonials';
import ClientLogos from '../components/ClientLogos';
import AOS from "aos";
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <div>
      <div data-aos="zoom-in" data-aos-duration="1200" data-aos-easing="ease-in-out"><Banner /></div>
      <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100"><HowWorks /></div>
      <div data-aos="fade-right" data-aos-delay="200" data-aos-duration="1100"><ClientLogos /></div>
      <div data-aos="fade-left" data-aos-delay="300" data-aos-duration="1100"><OurServices /></div>
      <div data-aos="zoom-in-up" data-aos-duration="1200" data-aos-easing="ease-in-out-sine"><DeliveryFeatures /></div>
      <div data-aos="flip-left" data-aos-duration="1000"><Motive /></div>
      <div data-aos="flip-down" data-aos-duration="1200" data-aos-delay="200"><Testimonials /></div>
      <div><FAQSection /></div>
    </div>
  );
};

export default Home;
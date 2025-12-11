import React from "react";
import Marquee from "react-fast-marquee";
import { FaAmazon, FaGoogle, FaMicrosoft, FaPaypal, FaUber } from "react-icons/fa";
import { SiTesla, SiSamsung, SiIntel } from "react-icons/si";

const partners = [
  { id: 1, icon: FaAmazon, name: "Amazon", color: "#FF9900" },
  { id: 2, icon: SiTesla, name: "Tesla", color: "#E82127" },
  { id: 3, icon: FaGoogle, name: "Google", color: "#4285F4" },
  { id: 4, icon: SiSamsung, name: "Samsung", color: "#1428A0" },
  { id: 5, icon: FaMicrosoft, name: "Microsoft", color: "#00A4EF" },
  { id: 6, icon: FaPaypal, name: "Paypal", color: "#003087" },
  { id: 7, icon: FaUber, name: "Uber", color: "#000000" },
  { id: 8, icon: SiIntel, name: "Intel", color: "#0071C5" },
  { id: 9, icon: FaAmazon, name: "Amazon", color: "#FF9900" },
  { id: 10, icon: SiTesla, name: "Tesla", color: "#E82127" },
  { id: 11, icon: FaGoogle, name: "Google", color: "#4285F4" },
  { id: 12, icon: SiSamsung, name: "Samsung", color: "#1428A0" },
  { id: 13, icon: FaMicrosoft, name: "Microsoft", color: "#00A4EF" },
  { id: 14, icon: FaPaypal, name: "Paypal", color: "#003087" },
  { id: 15, icon: FaUber, name: "Uber", color: "#000000" },
  { id: 16, icon: SiIntel, name: "Intel", color: "#0071C5" },
];

const ClientLogos = () => (
  <section className="bg-gray-100 pt-8 pb-12 my-4">
    <div className="max-w-6xl mx-auto text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-secondary">
        Trusted by Farmers & Agricultural Partners
      </h2>
      <p className="text-tertiary mt-2 px-4">
        Collaborating with industry leaders to bring the best technology to your field.
      </p>
    </div>

    <Marquee pauseOnHover gradient={false} speed={50}>
      {partners.map((partner) => (
        <div 
            key={partner.id} 
            className="mx-8 flex items-center justify-center"
            title={partner.name}
        >
          <partner.icon 
            className="text-5xl md:text-6xl transition-opacity duration-300 cursor-pointer opacity-70 hover:opacity-100"
            style={{ color: partner.color }}
          />
        </div>
      ))}
    </Marquee>
  </section>
);

export default ClientLogos;
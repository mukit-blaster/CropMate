import React from "react";
import { FaLinkedinIn, FaXTwitter, FaFacebookF, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router";
import Logo from "./Logo";

const links = [
  { label: "Services", to: "/" },
  { label: "Coverage", to: "/coverage" },
  { label: "Hire", to: "/hire" },
  { label: "Predict Crop", to: "/predict" },
  { label: "Find Disease", to: "/disease-detect" },
  { label: "Marketplace", to: "/sell" },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-6 mt-6">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid gap-5 md:grid-cols-3 items-start">
          <div className="text-center md:text-left">
            <Logo variant="light" />
            <p className="mt-2 text-xs text-gray-300 max-w-xs mx-auto md:mx-0 leading-relaxed">
              Smart, efficient farming with real-time insights. From seed to harvest — we
              optimize your yield every season.
            </p>
          </div>

          <div className="text-center">
            <h4 className="font-bold text-primary text-sm mb-2">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-300">
              {links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-primary transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-bold text-primary text-sm mb-2">Connect</h4>
            <div className="flex justify-center md:justify-end gap-2">
              <a href="#" aria-label="LinkedIn" className="p-1.5 rounded-full bg-white/10 hover:bg-primary hover:text-secondary transition">
                <FaLinkedinIn size={13} />
              </a>
              <a href="#" aria-label="Twitter" className="p-1.5 rounded-full bg-white/10 hover:bg-primary hover:text-secondary transition">
                <FaXTwitter size={13} />
              </a>
              <a href="#" aria-label="Facebook" className="p-1.5 rounded-full bg-white/10 hover:bg-primary hover:text-secondary transition">
                <FaFacebookF size={13} />
              </a>
              <a href="#" aria-label="YouTube" className="p-1.5 rounded-full bg-white/10 hover:bg-primary hover:text-secondary transition">
                <FaYoutube size={13} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-4 pt-3 text-center text-[11px] text-gray-400">
          © {new Date().getFullYear()} CropMate — All rights reserved.
        </div>
      </div>
    </footer>
  );
}

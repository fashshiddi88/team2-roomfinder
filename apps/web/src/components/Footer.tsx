import React from 'react';
import Link from 'next/link';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialList = ['facebook', 'twitter', 'instagram', 'linkedin'] as const;
  type Social = (typeof socialList)[number];

  const icons: Record<Social, React.ReactElement> = {
    facebook: <FaFacebookF />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    linkedin: <FaLinkedinIn />,
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Room Finder</h3>
            <p className="text-gray-400 mb-4">
              The best accommodation search platform with competitive prices and
              easy transactions.
            </p>

            {/* Social icons in a row */}
            <div className="flex space-x-4 mt-4">
              {socialList.map((social) => (
                <a
                  key={social}
                  href="#" // Replace with actual links
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors text-white text-sm"
                  aria-label={`Follow us on ${social}`}
                >
                  {icons[social]}
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {[
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Blog', 'Partners'],
            },
            {
              title: 'Support',
              links: [
                'Help Center',
                'Privacy Policy',
                'Terms & Conditions',
                'Contact',
              ],
            },
            {
              title: 'Popular Destinations',
              links: ['Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Lombok'],
            },
          ].map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer bottom text */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© {currentYear} Room Finder. All rights reserved.</p>
          <p className="mt-2 text-sm">
            This platform is part of a final web development project.
          </p>
        </div>
      </div>
    </footer>
  );
}

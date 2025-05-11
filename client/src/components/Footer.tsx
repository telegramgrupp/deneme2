import { Video, Heart, GitHub, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Video className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-gray-900">VideoChat</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Connect with random people through video chat or enjoy our premium features with coins.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-base text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/match" className="text-base text-gray-600 hover:text-primary transition-colors">
                  Video Chat
                </Link>
              </li>
              <li>
                <Link to="/purchase" className="text-base text-gray-600 hover:text-primary transition-colors">
                  Buy Coins
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-base text-gray-600 hover:text-primary transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-base text-gray-600 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <GitHub className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} VideoChat. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0 text-sm text-gray-500 flex items-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for random connections
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
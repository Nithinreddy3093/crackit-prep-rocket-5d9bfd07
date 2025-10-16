
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-darkBlue-900 py-12 border-t border-darkBlue-800">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">TechPrep</h3>
            <p className="text-blue-300 mb-4">
              Preparing the next generation of software engineers for technical interviews.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-blue-400 hover:text-blue-300">About</Link>
              </li>
              <li>
                <Link to="/features" className="text-blue-400 hover:text-blue-300">Features</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-blue-400 hover:text-blue-300">Pricing</Link>
              </li>
              <li>
                <Link to="/careers" className="text-blue-400 hover:text-blue-300">Careers</Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-400 hover:text-blue-300">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/guides" className="text-blue-400 hover:text-blue-300">Study Guides</Link>
              </li>
              <li>
                <Link to="/blog" className="text-blue-400 hover:text-blue-300">Blog</Link>
              </li>
              <li>
                <Link to="/faq" className="text-blue-400 hover:text-blue-300">FAQ</Link>
              </li>
              <li>
                <Link to="/companies" className="text-blue-400 hover:text-blue-300">Companies</Link>
              </li>
              <li>
                <Link to="/support" className="text-blue-400 hover:text-blue-300">Support</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-blue-400 hover:text-blue-300">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-darkBlue-800 mt-8 pt-8 text-center">
          <p className="text-blue-400">&copy; {new Date().getFullYear()} TechPrep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              SaaS Base AI
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              AI-powered task management that helps you stay organized,
              prioritize effectively, and accomplish more every day.
            </p>
            <p className="text-sm text-gray-500">
              Built with ❤️ using Next.js, MongoDB, and OpenRouter AI
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>→</span> Features
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>→</span> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>→</span> Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} SaaS Base AI. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <Link
                href="https://github.com/rozenaakter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/most-rozena-akter/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="90rozena@gamil.com"
                className="hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Tech Stack Credit */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Powered by{" "}
              <span className="text-blue-400">Next.js</span>,{" "}
              <span className="text-green-400">MongoDB</span>, and{" "}
              <span className="text-purple-400">OpenRouter AI (FREE)</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
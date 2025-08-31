"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiHome,FiBook, FiFileText, FiSearch,FiLogOut} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";


export default function Navbarprofessor() {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/Student_login");
  };
  return (
    <nav className="relative bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white shadow-2xl backdrop-blur-lg border-b border-white/20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-24 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center group">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 group-hover:bg-white/30 transition-all duration-300 shadow-lg">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
              <div className="ml-3">
                <span className="font-bold text-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  StudyBuddy
                </span>
                <p className="text-xs text-blue-100 font-medium">Student Portal</p>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link 
              href="/" 
              className="flex items-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiHome className="mr-2 text-lg" />
              Home
            </Link>
            
            <Link 
              href="/create_classroom" 
              className="flex items-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiBook className="mr-2 text-lg" />
              create classroom
            </Link>
            
            <Link 
              href="/Professor_classrooms" 
              className="flex items-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiSearch className="mr-2 text-lg" />
              Browse your classes
            </Link>

            <Link 
              href="/Professor_profile" 
              className="flex items-center px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiFileText className="mr-2 text-lg" />
              view your profile
            </Link>


            <button 
                          onClick={logout}
                          className="flex items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <FiLogOut className="mr-2 text-lg" />
                          Logout
                        </button>


          </div>
        </div>
      </div>
    </nav>
  );
}
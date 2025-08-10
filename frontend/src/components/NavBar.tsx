"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const router = useRouter();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      router.push(value);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/Professor_login");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex space-x-7">
            <Link href="/" className="flex items-center">
              <span className="font-semibold text-xl tracking-tight hover:text-indigo-200 transition-colors">
                Professor Portal
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="py-2 px-3 rounded hover:bg-indigo-500 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/Professor_profile" 
              className="py-2 px-3 rounded hover:bg-indigo-500 transition-colors"
            >
              View Your Profile
            </Link>
            
            <div className="relative group">
              <select 
                onChange={handleSelectChange} 
                defaultValue=""
                className="bg-indigo-700 text-white py-2 px-4 rounded appearance-none hover:bg-indigo-800 transition-colors pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="" disabled>Quick Actions</option>
                <option value="/create_classroom">Create Classroom</option>
                <option value="/Professor_classrooms">Manage Classes</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>

            {/* Logout Button - Desktop */}
            <button 
              onClick={logout}
              className="py-2 px-4 rounded bg-red-500 hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
          
          
        </div>
      </div>
      
     
    </nav>
  );
}
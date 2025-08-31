"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { FiBook, FiUsers, FiCalendar, FiPlus, FiEye } from "react-icons/fi";
import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import Navbarprofessor from "@/components/Navbarprofessor";

export default function YourClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        router.push("/Student_login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/fetch_classes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please log in again.");
            router.push("/login");
          } else {
            const data = await response.json();
            throw new Error(data.detail || "Failed to fetch classes");
          }
          return;
        }

        const data = await response.json();
        console.log(data)
        setClasses(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="animate-pulse flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-200 to-purple-200 rounded-2xl mb-8 animate-bounce flex items-center justify-center">
          <FaChalkboardTeacher className="text-3xl text-violet-600" />
        </div>
        <div className="h-8 bg-gradient-to-r from-slate-200 to-blue-200 rounded-xl w-64 mb-4"></div>
        <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-80 mb-2"></div>
        <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-72"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-2xl inline-block mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={() => router.push('/Professor_login')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbarprofessor />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
            <div className="relative bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-10 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
                <div className="text-center lg:text-left mb-8 lg:mb-0">
                  <div className="flex items-center justify-center lg:justify-start mb-6">
                    <div className="bg-white/20 p-4 rounded-2xl mr-4 backdrop-blur-sm">
                      <FaChalkboardTeacher className="text-4xl text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Your Classrooms
                      </h1>
                      <p className="text-blue-100 text-xl font-medium mt-2">
                        Manage and monitor your teaching spaces
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6">
                    <span className="flex items-center text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      <FiBook className="mr-2" /> {classes.length} Active Classroom{classes.length !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      <FaGraduationCap className="mr-2" /> Total Capacity: {classes.reduce((sum: number, classroom: any) => sum + parseInt(classroom.class_capacity), 0)} Students
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Link
                    href="/create_classroom"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl hover:from-white/30 hover:to-white/20 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <FiPlus className="mr-3 text-xl" />
                    Create New Classroom
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Classrooms Grid */}
          {classes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-16">
              <div className="text-center">
                <div className="bg-gradient-to-r from-slate-400 to-gray-500 p-6 rounded-3xl inline-block mb-8">
                  <FaChalkboardTeacher className="text-5xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">No Classrooms Yet</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  You haven't created any classrooms yet. Start building your first learning environment!
                </p>
                <Link
                  href="/create_classroom"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FiPlus className="mr-3 text-xl" />
                  Create Your First Classroom
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {classes.map((classroom: any, index: number) => (
                <Link
                  key={index}
                  href={`/Professor_classrooms/${classroom.class_id}`}
                  className="group"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]">
                    {/* Classroom Image */}
                    <div className="relative h-48 overflow-hidden">
                      {classroom.classroom_picture ? (
                        <img
                          src={classroom.classroom_picture}
                          alt={classroom.class_title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-400 via-blue-500 to-cyan-400 flex items-center justify-center">
                          <FaChalkboardTeacher className="text-6xl text-white/80" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Subject Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold border border-white/30">
                          {classroom.class_field}
                        </span>
                      </div>
                      
                      {/* View Button */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200">
                          <FiEye className="text-white text-lg" />
                        </div>
                      </div>
                      
                      {/* Capacity Badge */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 rounded-full flex items-center shadow-lg">
                          <FiUsers className="text-white text-sm mr-1" />
                          <span className="text-white text-sm font-semibold">{classroom.class_capacity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-violet-600 transition-colors duration-200 line-clamp-2">
                        {classroom.class_title}
                      </h2>
                      
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {classroom.description}
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                        <div className="flex items-center text-slate-500">
                          <FiCalendar className="text-sm mr-2" />
                          <span className="text-xs font-medium">
                            {new Date(classroom.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-semibold text-emerald-600">Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          
        </div>
      </div>
    </>
  );
}

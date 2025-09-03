"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbarprofessor from "@/components/Navbarprofessor";

type ParamsType = Promise<{ id: string }>;

export default function CourseContent({ params }: { params: ParamsType }) {
  

  const { id } = use(params);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [classData, setClassData] = useState<any>(null);

  const [contents, setContents] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchClassById = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/classes/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }

        const data = await response.json();
        setClassData(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchClassById();
  }, [id, router]);

  const fetchClassroomContent = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Please login");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8000/view_classroom_content_as_professor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch classroom content");

      const data = await res.json();
      setContents(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClassroomContent();
  }, [id]);

  const handleUpload = async () => {
    if (!file || !description) {
      alert("Please select a file and enter a description.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("classroom_id", id);

    try {
      const res = await fetch("http://localhost:8000/upload_your_pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      alert("File uploaded successfully!");
      setShowModal(false);
      setFile(null);
      setDescription("");
      fetchClassroomContent(); // refresh list
    } catch (err: any) {
      console.log(err);
      alert(err.message);
    }
  };

  // Handle PDF download button
  const handleDownload = async (contentId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to download.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/download_pdf/${id}/content/${contentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error("No download URL found");
      }

      window.open(data.url, "_blank");
    } catch (error: any) {
      alert(error.message || "Download failed");
    }
  };

  // Loading / Error / Empty states
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="w-40 h-40 bg-gradient-to-br from-slate-200 to-blue-200 rounded-2xl mb-8 animate-bounce"></div>
          <div className="h-8 bg-gradient-to-r from-slate-200 to-blue-200 rounded-xl w-64 mb-4"></div>
          <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-80 mb-2"></div>
          <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-72"></div>
        </div>
      </div>
    );
  if (error)
    return (
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
          </div>
        </div>
      </div>
    );
  if (!classData)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="bg-gradient-to-r from-gray-500 to-slate-500 p-4 rounded-2xl inline-block mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">No Class Data Found</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">The requested classroom could not be found.</p>
          </div>
        </div>
      </div>
    );

  // Main UI
  return (
    <><Navbarprofessor/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Class Header */}
          <div className="relative bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-10 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
              <div className="flex flex-col lg:flex-row items-center mb-6 lg:mb-0">
                <div className="relative mb-8 lg:mb-0 lg:mr-10">
                  <div className="relative">
                    {classData.classroom_picture ? (
                      <img
                        src={classData.classroom_picture}
                        alt={classData.class_title}
                        className="w-40 h-40 rounded-2xl border-4 border-white/30 object-cover shadow-2xl ring-4 ring-white/20"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-2xl border-4 border-white/30 bg-gradient-to-br from-white/20 to-white/10 shadow-2xl ring-4 ring-white/20 flex items-center justify-center">
                        <svg className="text-white text-6xl" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
                      <svg className="text-white text-2xl w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L21 11l-9-8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {classData.class_title || "Untitled Course"}
                  </h1>
                  <p className="text-blue-100 text-xl mb-4 font-medium">{classData.class_field}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6">
                    <span className="flex items-center text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.99 2.99 0 0 0 17.18 7H14.5l-.93 2.63A2.99 2.99 0 0 0 13 11h-2c-1.66 0-3 1.34-3 3v8h12z"/>
                      </svg>
                      Capacity: {classData.class_capacity}
                    </span>
                    <span className="flex items-center text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                      </svg>
                      Created {new Date(classData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="relative z-10 mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-white/90 leading-relaxed text-lg">
                {classData.description || "No description provided for this classroom."}
              </p>
              <p className="mt-4 text-white/70 text-sm">
                Created on {new Date(classData.created_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} at {new Date(classData.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Content Management Section */}
          <div className="p-10">
            {/* Add Course Content Button */}
            <div className="mb-8">
              <button
                className="flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => setShowModal(true)}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Add Course Content
              </button>
            </div>

            {/* Course Content List */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200/50">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4 shadow-lg">
                  <svg className="text-white text-xl w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                  </svg>
                </div>
                Course Content
              </h2>
              
              {contents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 inline-block mb-6">
                    <svg className="w-16 h-16 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No content uploaded yet</h3>
                  <p className="text-slate-500">Start by adding some course materials for your students.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {contents.map((item) => (
                    <div
                      key={item.cloudinary_public_id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-start flex-1">
                          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-xl mr-5 shadow-lg group-hover:shadow-xl transition-all duration-200">
                            <svg className="text-white text-xl w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{item.filename}</h3>
                            <p className="text-slate-600 mb-3 leading-relaxed">{item.description}</p>
                            <div className="flex items-center text-sm text-slate-500">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                              </svg>
                              Uploaded on {new Date(item.uploaded_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(item.classroom_content_id)}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Upload Course Content
              </h2>
              <p className="text-emerald-100">
                Add new materials for {classData.class_title}
              </p>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-3">Select PDF File</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/70 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-3">Description</label>
                <textarea
                  placeholder="Enter a description for this content (e.g., Chapter 1: Introduction to Programming)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 resize-none bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-slate-50/80 backdrop-blur-sm p-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border-2 border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 font-medium order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2"
              >
                Upload Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiBook, FiUsers, FiLock, FiFileText, FiImage, FiPlus } from "react-icons/fi";
import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import NavBar from "@/components/NavBar";
export default function CreateClassroom() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    class_title: "",
    class_capacity: "",
    class_field: "",
    description: "",
    classroom_password: "",
  });
  const [classroomPicture, setClassroomPicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setClassroomPicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("class_title", formData.class_title);
      formDataToSend.append("class_capacity", formData.class_capacity);
      formDataToSend.append("class_field", formData.class_field);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("classroom_password", formData.classroom_password);
      if (classroomPicture) {
        formDataToSend.append("classroom_picture", classroomPicture);
      }

      const response = await fetch("http://localhost:8000/create_your_classroom", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create classroom");
      }

      const data = await response.json();
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        router.push("/Professor_classrooms");
      }, 2000);
     
    } catch (err: any) {
      setError(err.message || "Something went wrong while creating the classroom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
            <div className="relative bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-10 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                  <FaChalkboardTeacher className="text-4xl text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Create New Classroom
                </h1>
                <p className="text-blue-100 text-xl font-medium max-w-2xl mx-auto">
                  Build an engaging learning environment for your students
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-10">
              {/* Success Message */}
              {success && (
                <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl mr-4">
                      <FaGraduationCap className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-emerald-800 font-bold text-lg">Classroom Created Successfully!</h3>
                      <p className="text-emerald-600">Redirecting you to your classrooms...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-red-800 font-bold text-lg">Error Creating Classroom</h3>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Classroom Title */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-3">
                        <FiBook className="text-white text-lg" />
                      </div>
                      <label htmlFor="class_title" className="text-xl font-bold text-slate-800">
                        Classroom Title
                      </label>
                    </div>
                    <input
                      type="text"
                      id="class_title"
                      name="class_title"
                      value={formData.class_title}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Advanced Mathematics, Computer Science 101"
                      className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm text-lg"
                    />
                  </div>

                  {/* Capacity */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl mr-3">
                        <FiUsers className="text-white text-lg" />
                      </div>
                      <label htmlFor="class_capacity" className="text-xl font-bold text-slate-800">
                        Student Capacity
                      </label>
                    </div>
                    <input
                      type="number"
                      id="class_capacity"
                      name="class_capacity"
                      value={formData.class_capacity}
                      onChange={handleChange}
                      min="1"
                      max="1000"
                      required
                      placeholder="Maximum number of students"
                      className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/70 backdrop-blur-sm text-lg"
                    />
                  </div>

                  {/* Field of Study */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200/50">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl mr-3">
                        <FaGraduationCap className="text-white text-lg" />
                      </div>
                      <label htmlFor="class_field" className="text-xl font-bold text-slate-800">
                        Field of Study
                      </label>
                    </div>
                    <input
                      type="text"
                      id="class_field"
                      name="class_field"
                      value={formData.class_field}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Mathematics, Computer Science, Physics"
                      className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/70 backdrop-blur-sm text-lg"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Description */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200/50">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-xl mr-3">
                        <FiFileText className="text-white text-lg" />
                      </div>
                      <label htmlFor="description" className="text-xl font-bold text-slate-800">
                        Description
                      </label>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      required
                      placeholder="Describe your classroom, learning objectives, and what students can expect..."
                      className="w-full p-4 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 resize-none bg-white/70 backdrop-blur-sm text-lg"
                    />
                  </div>

                  {/* Password */}
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200/50">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-3 rounded-xl mr-3">
                        <FiLock className="text-white text-lg" />
                      </div>
                      <label htmlFor="classroom_password" className="text-xl font-bold text-slate-800">
                        Classroom Password
                      </label>
                    </div>
                    <input
                      type="password"
                      id="classroom_password"
                      name="classroom_password"
                      value={formData.classroom_password}
                      onChange={handleChange}
                      required
                      placeholder="Set a secure password for your classroom"
                      className="w-full p-4 border-2 border-rose-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 bg-white/70 backdrop-blur-sm text-lg"
                    />
                  </div>
                </div>

                {/* Full Width Image Upload */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200/50">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-slate-500 to-gray-600 p-3 rounded-xl mr-3">
                        <FiImage className="text-white text-lg" />
                      </div>
                      <label htmlFor="classroom_picture" className="text-xl font-bold text-slate-800">
                        Classroom Picture
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <input
                          type="file"
                          id="classroom_picture"
                          name="classroom_picture"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white/70 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-violet-500 file:to-purple-600 file:text-white hover:file:from-violet-600 hover:file:to-purple-700"
                        />
                        <p className="text-slate-600 text-sm mt-2">Upload an image that represents your classroom (optional)</p>
                      </div>
                      
                      {imagePreview && (
                        <div className="flex justify-center">
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Classroom Preview"
                              className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-lg"
                            />
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg shadow-lg">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="lg:col-span-2 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-8 py-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Your Classroom...
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-3 text-2xl" />
                        Create Classroom
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
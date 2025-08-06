"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiPhone, FiMapPin, FiBook, FiCalendar, FiUser, FiEdit } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";

type ProfessorProfile = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  country: string;
  educational_field: string;
  description: string;
  joined_at: string;
  profile_picture: string;
};

export default function ProfessorProfilePage() {
  const [profile, setProfile] = useState<ProfessorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ProfessorProfile>>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/professor_profile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile.");
        }

        const data = await response.json();
        setProfile(data);
        setEditData(data); // Initialize edit data with current profile
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
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
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      
      if (editData.first_name) formData.append("first_name", editData.first_name);
      if (editData.last_name) formData.append("last_name", editData.last_name);
      if (editData.phone_number) formData.append("phone_number", editData.phone_number);
      if (editData.email) formData.append("email", editData.email);
      if (editData.country) formData.append("country", editData.country);
      if (editData.educational_field) formData.append("educational_field", editData.educational_field);
      if (editData.description) formData.append("description", editData.description);
      if (profileImage) formData.append("profile_picture", profileImage);

      const response = await fetch("http://localhost:8000/professor_edit_profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const data = await response.json();
      setProfile(data);
      setIsEditing(false);
      if (profileImage) {
        setImagePreview(null);
        setProfileImage(null);
      }
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile || {});
    setImagePreview(null);
    setProfileImage(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="animate-pulse flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
        <div className="w-40 h-40 bg-gradient-to-br from-slate-200 to-blue-200 rounded-2xl mb-8 animate-bounce"></div>
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
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="bg-gradient-to-r from-slate-400 to-gray-500 p-4 rounded-2xl inline-block mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No Profile Found</h2>
          <p className="text-slate-600 leading-relaxed">We couldn't find any profile information. Please try refreshing the page or contact support.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-10 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center">
              <div className="relative mb-8 lg:mb-0 lg:mr-10">
                <div className="relative">
                  <img
                    src={imagePreview || profile.profile_picture}
                    alt="Profile"
                    className="w-40 h-40 rounded-2xl border-4 border-white/30 object-cover shadow-2xl ring-4 ring-white/20"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
                    <FaGraduationCap className="text-white text-2xl" />
                  </div>
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <label className="cursor-pointer bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <span className="text-white text-sm font-semibold">Change Photo</span>
                    </label>
                  </div>
                )}
              </div>
              <div className="text-center lg:text-left flex-1">
                {isEditing ? (
                  <>
                    <div className="mb-6 space-y-3">
                      <input
                        type="text"
                        name="first_name"
                        value={editData.first_name || ""}
                        onChange={handleInputChange}
                        className="text-4xl font-bold bg-white/10 border-b-2 border-white/50 text-white placeholder-white/70 w-full px-2 py-1 rounded-t-lg backdrop-blur-sm focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="last_name"
                        value={editData.last_name || ""}
                        onChange={handleInputChange}
                        className="text-4xl font-bold bg-white/10 border-b-2 border-white/50 text-white placeholder-white/70 w-full px-2 py-1 rounded-t-lg backdrop-blur-sm focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200"
                        placeholder="Last Name"
                      />
                    </div>
                    <input
                      type="text"
                      name="educational_field"
                      value={editData.educational_field || ""}
                      onChange={handleInputChange}
                      className="text-xl text-white/90 bg-white/10 border-b border-white/40 w-full px-2 py-1 rounded-t-lg backdrop-blur-sm focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200"
                      placeholder="Educational Field"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">{profile.first_name} {profile.last_name}</h1>
                    <p className="text-blue-100 text-xl mb-4 font-medium">{profile.educational_field}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6">
                      <span className="flex items-center text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                        <FiMapPin className="mr-2" /> {profile.country}
                      </span>
                      <span className="flex items-center text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                        <FiCalendar className="mr-2" /> Member since {new Date(profile.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-2 rounded-xl mr-3">
                        <FiUser className="text-white text-lg" />
                      </div>
                      About Me
                    </h2>
                    <textarea
                      name="description"
                      value={editData.description || ""}
                      onChange={handleInputChange}
                      className="w-full h-44 p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 resize-none bg-white/70 backdrop-blur-sm"
                      placeholder="Tell us about yourself, your experience, and expertise..."
                    />
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl mr-3">
                        <FiBook className="text-white text-lg" />
                      </div>
                      Educational Field
                    </h2>
                    <input
                      type="text"
                      name="educational_field"
                      value={editData.educational_field || ""}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="e.g., Computer Science, Mathematics, Physics..."
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl mr-3">
                      <FiMail className="text-white text-lg" />
                    </div>
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white/80 transition-all duration-200">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4 shadow-lg">
                          <FiMail className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-600 mb-2">Email Address</h3>
                          <input
                            type="email"
                            name="email"
                            value={editData.email || ""}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                            placeholder="your.email@domain.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white/80 transition-all duration-200">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl mr-4 shadow-lg">
                          <FiPhone className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-600 mb-2">Phone Number</h3>
                          <input
                            type="tel"
                            name="phone_number"
                            value={editData.phone_number || ""}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white/80 transition-all duration-200">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl mr-4 shadow-lg">
                          <FiMapPin className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-600 mb-2">Location</h3>
                          <input
                            type="text"
                            name="country"
                            value={editData.country || ""}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                            placeholder="Country, City"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 border-2 border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 p-10">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-2 rounded-xl mr-3">
                      <FiUser className="text-white text-lg" />
                    </div>
                    About Me
                  </h2>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {profile.description || "No description provided yet. Click edit to add your professional background and expertise."}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl mr-3">
                      <FiBook className="text-white text-lg" />
                    </div>
                    Educational Field
                  </h2>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 shadow-lg">
                    <p className="text-white font-semibold text-xl">{profile.educational_field}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl mr-3">
                    <FiMail className="text-white text-lg" />
                  </div>
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl mr-5 shadow-lg group-hover:shadow-xl transition-all duration-200">
                        <FiMail className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Email Address</h3>
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-150 text-lg font-medium hover:underline"
                        >
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl mr-5 shadow-lg group-hover:shadow-xl transition-all duration-200">
                        <FiPhone className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Phone Number</h3>
                        <a 
                          href={`tel:${profile.phone_number}`} 
                          className="text-slate-700 hover:text-slate-900 transition-colors duration-150 text-lg font-medium hover:underline"
                        >
                          {profile.phone_number}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 rounded-xl mr-5 shadow-lg group-hover:shadow-xl transition-all duration-200">
                        <FiMapPin className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Location</h3>
                        <p className="text-slate-700 text-lg font-medium">{profile.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    onClick={handleEditClick}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <FiEdit className="mr-3 text-xl" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiPhone, FiMapPin, FiBook, FiCalendar, FiUser, FiEdit } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import NavBar from "@/components/NavBar";

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  academic_level: string;
  country: string;
  descritpion: string;
  joined_at: string;
  profile_image?: string;
};

export default function ViewProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState<Profile | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      setError("Authentication required. Please log in.");
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/view_profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
        setTempProfile(data);
        if (data.profile_image) {
          setPreviewImage(data.profile_image);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setTempProfile(profile);
    setSuccess(false);
    setError("");
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setTempProfile(profile);
    setProfileImage(null);
    if (profile?.profile_image) {
      setPreviewImage(profile.profile_image);
    } else {
      setPreviewImage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("first_name", tempProfile!.first_name);
      formData.append("last_name", tempProfile!.last_name);
      formData.append("email", tempProfile!.email);
      formData.append("phone_number", tempProfile!.phone_number);
      formData.append("academic_level", tempProfile!.academic_level);
      formData.append("country", tempProfile!.country);
      formData.append("descritpion", tempProfile!.descritpion);
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await fetch("http://localhost:8000/edit_your_profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSuccess(true);
      setEditMode(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while updating your profile.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
        </div>
      </div>
    </div>
  );

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-10 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
              <div className="flex flex-col lg:flex-row items-center mb-6 lg:mb-0">
                <div className="relative mb-8 lg:mb-0 lg:mr-10">
                  <div className="relative">
                    {(editMode ? previewImage : profile?.profile_image) ? (
                      <img
                        src={editMode ? previewImage : profile?.profile_image}
                        alt="Profile"
                        className="w-40 h-40 rounded-2xl border-4 border-white/30 object-cover shadow-2xl ring-4 ring-white/20"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-2xl border-4 border-white/30 bg-gradient-to-br from-white/20 to-white/10 shadow-2xl ring-4 ring-white/20 flex items-center justify-center">
                        <FiUser className="text-white text-6xl" />
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
                      <FaGraduationCap className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {profile?.first_name} {profile?.last_name}
                  </h1>
                  <p className="text-blue-100 text-xl mb-4 font-medium">{profile?.academic_level}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6">
                    <span className="flex items-center text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      <FiMapPin className="mr-2" /> {profile?.country || "Not provided"}
                    </span>
                    <span className="flex items-center text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      <FiCalendar className="mr-2" /> Member since {new Date(profile?.joined_at || "").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                </div>
              </div>
              
              {!editMode && (
                <button
                  onClick={handleEditClick}
                  className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FiEdit className="mr-2 text-lg" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {success && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 mx-10 mt-6 rounded-xl">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-800 font-semibold">Profile updated successfully!</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-4 mx-10 mt-6 rounded-xl">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* Profile Details */}
          {editMode ? (
            <form onSubmit={handleSubmit} className="p-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-2 rounded-xl mr-3">
                        <FiUser className="text-white text-lg" />
                      </div>
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={tempProfile?.first_name || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={tempProfile?.last_name || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl mr-3">
                        <FiBook className="text-white text-lg" />
                      </div>
                      Academic Information
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Academic Level</label>
                        <select
                          name="academic_level"
                          value={tempProfile?.academic_level || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                        >
                          <option value="">Select your academic level</option>
                          <option value="High School">High School</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Postgraduate">Postgraduate</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={tempProfile?.country || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-xl mr-3">
                        <FiUser className="text-white text-lg" />
                      </div>
                      Profile Image
                    </h2>
                    <div className="flex items-center gap-6">
                      {previewImage && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-200">
                          <img 
                            src={previewImage} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full p-4 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 bg-white/70 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl mr-3">
                        <FiMail className="text-white text-lg" />
                      </div>
                      Contact Information
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={tempProfile?.email || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={tempProfile?.phone_number || ""}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-xl mr-3">
                        <FiUser className="text-white text-lg" />
                      </div>
                      About Me
                    </h2>
                    <textarea
                      name="descritpion"
                      value={tempProfile?.descritpion || ""}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none bg-white/70 backdrop-blur-sm"
                      placeholder="Tell us about yourself, your interests, and academic goals..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="px-8 py-3 border-2 border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
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
                    {profile?.descritpion || "No description provided yet. Click edit to add your academic background and interests."}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl mr-3">
                      <FiBook className="text-white text-lg" />
                    </div>
                    Academic Level
                  </h2>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 shadow-lg">
                    <p className="text-white font-semibold text-xl">{profile?.academic_level || "Not provided"}</p>
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
                          href={`mailto:${profile?.email}`} 
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-150 text-lg font-medium hover:underline"
                        >
                          {profile?.email}
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
                          href={`tel:${profile?.phone_number}`} 
                          className="text-slate-700 hover:text-slate-900 transition-colors duration-150 text-lg font-medium hover:underline"
                        >
                          {profile?.phone_number || "Not provided"}
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
                        <p className="text-slate-700 text-lg font-medium">{profile?.country || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-xl mr-5 shadow-lg group-hover:shadow-xl transition-all duration-200">
                        <FiCalendar className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Member Since</h3>
                        <p className="text-slate-700 text-lg font-medium">{new Date(profile?.joined_at || "").toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
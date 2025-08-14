"use client"

import { useState } from "react"

export default function StudentRegistration() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        academic_level: "",
        profile_image: null as File | null,
        country: "",
        descritpion: "" // match backend spelling
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")
    const [previewSrc, setPreviewSrc] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e: any) => {
        const file = e.target.files[0]
        setFormData(prev => ({
            ...prev,
            profile_image: file
        }))

        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewSrc(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPreviewSrc(null)
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('first_name', formData.first_name)
            formDataToSend.append('last_name', formData.last_name)
            formDataToSend.append('email', formData.email)
            formDataToSend.append('password', formData.password)
            formDataToSend.append('phone_number', formData.phone_number)
            formDataToSend.append('academic_level', formData.academic_level)
            if (formData.profile_image) {
                formDataToSend.append('profile_image', formData.profile_image)
            }
            formDataToSend.append('country', formData.country)
            formDataToSend.append('descritpion', formData.descritpion) // match backend

            const response = await fetch('http://localhost:8000/register_student', {
                method: 'POST',
                body: formDataToSend
            })

            const result = await response.json()
            if (response.ok) {
                setMessage("User registered successfully")
                setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    phone_number: "",
                    academic_level: "",
                    profile_image: null as File | null,
                    country: "",
                    descritpion: ""
                })
                setPreviewSrc(null)
            } else {
                setMessage(result.message || "Registration failed")
            }
        } catch (error) {
            setMessage("An error occurred during registration")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 py-10 px-10 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                    
                    <div className="relative z-10 text-center">
                        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-4 rounded-2xl inline-block mb-6 shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">Student Registration</h1>
                        <p className="text-green-100 mt-3 text-lg">Join our educational community and start your learning journey</p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="p-10">
                    {message && (
                        <div className={`mb-8 p-6 rounded-2xl border flex items-center shadow-lg ${
                            message.includes("successfully") 
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200/50" 
                                : "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200/50"
                        }`}>
                            <div className={`p-2 rounded-xl mr-4 ${
                                message.includes("successfully") 
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                                    : "bg-gradient-to-r from-red-500 to-pink-500"
                            }`}>
                                {message.includes("successfully") ? (
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className="font-semibold text-lg">{message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200/50">
                                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text" 
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg bg-white/70 backdrop-blur-sm"
                                    placeholder="John"
                                    required
                                />
                            </div>

                            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200/50">
                                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg bg-white/70 backdrop-blur-sm"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg bg-white/70 backdrop-blur-sm"
                                placeholder="student@university.edu"
                                required
                            />
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200/50">
                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 pr-14 text-lg bg-white/70 backdrop-blur-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 px-4 flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="tel" 
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-lg bg-white/70 backdrop-blur-sm"
                                placeholder="+216 12 345 678"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200/50">
                                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                    Academic Level <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="academic_level"
                                    value={formData.academic_level}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 border-2 border-cyan-200 rounded-xl focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 text-lg bg-white/70 backdrop-blur-sm"
                                    placeholder="Bachelor's, Master's, PhD..."
                                    required
                                />
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200/50">
                                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-lg bg-white/70 backdrop-blur-sm"
                                    placeholder="Tunisia"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200/50">
                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                name="descritpion" // match backend typo
                                value={formData.descritpion}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-4 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none text-lg bg-white/70 backdrop-blur-sm"
                                placeholder="Tell us about yourself, your academic interests, goals, and what motivates you to learn..."
                                required
                            />
                        </div>

                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200/50">
                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                Profile Picture <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="relative">
                                    <input
                                        id="profile_image"
                                        type="file" 
                                        name="profile_image"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    <label
                                        htmlFor="profile_image"
                                        className="px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white border border-transparent rounded-xl shadow-lg cursor-pointer hover:from-pink-600 hover:to-rose-600 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold"
                                    >
                                        Choose File
                                    </label>
                                </div>
                                <span className="text-slate-600 font-medium">
                                    {formData.profile_image ? formData.profile_image.name : "No file chosen"}
                                </span>
                            </div>
                            {previewSrc && (
                                <div className="mt-6">
                                    <p className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Preview:</p>
                                    <img
                                        src={previewSrc}
                                        alt="preview"
                                        className="w-32 h-32 object-cover rounded-2xl border-4 border-pink-200 shadow-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-lg transform hover:-translate-y-0.5"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registering...
                                    </>
                                ) : (
                                    "Register Now"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-green-50 px-10 py-6 border-t border-slate-200/50 text-center">
                    <p className="text-slate-600 text-lg">
                        Already have an account?{' '}
                        <a href="#" className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

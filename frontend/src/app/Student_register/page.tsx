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
        profile_image: null,
        country: "",
        descritpion: "" // match backend spelling
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e: any) => {
        setFormData(prev => ({
            ...prev,
            profile_image: e.target.files[0]
        }))
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
                    profile_image: null,
                    country: "",
                    descritpion: ""
                })
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
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Student Registration</h2>
            
            <div className="mb-4">
                <label className="block mb-2">
                    First Name:
                    <input 
                        type="text" 
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2">
                    Last Name:
                    <input 
                        type="text" 
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2">
                    Email:
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2">
                    Password:
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2">
                    Phone Number:
                    <input 
                        type="tel" 
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2">
                    Academic Level:
                    <input 
                        type="text" 
                        name="academic_level"
                        value={formData.academic_level}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2">
                    Profile Picture:
                    <input 
                        type="file" 
                        name="profile_image"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2">
                    Country:
                    <input 
                        type="text" 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2">
                    Description:
                    <textarea 
                        name="descritpion" // match backend typo
                        value={formData.descritpion}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isSubmitting ? "Registering..." : "Register"}
            </button>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </form>
    )
}

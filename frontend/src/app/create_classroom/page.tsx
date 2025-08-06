"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      setClassroomPicture(e.target.files[0]);
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
     
    } catch (err: any) {
      setError(err.message || "Something went wrong while creating the classroom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Classroom</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Classroom created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="class_title" className="block text-sm font-medium text-gray-700">
            Classroom Title
          </label>
          <input
            type="text"
            id="class_title"
            name="class_title"
            value={formData.class_title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="class_capacity" className="block text-sm font-medium text-gray-700">
            Capacity
          </label>
          <input
            type="number"
            id="class_capacity"
            name="class_capacity"
            value={formData.class_capacity}
            onChange={handleChange}
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="class_field" className="block text-sm font-medium text-gray-700">
            Field of Study
          </label>
          <input
            type="text"
            id="class_field"
            name="class_field"
            value={formData.class_field}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="classroom_password" className="block text-sm font-medium text-gray-700">
            Classroom Password
          </label>
          <input
            type="password"
            id="classroom_password"
            name="classroom_password"
            value={formData.classroom_password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="classroom_picture" className="block text-sm font-medium text-gray-700">
            Classroom Picture
          </label>
          <input
            type="file"
            id="classroom_picture"
            name="classroom_picture"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? "Creating..." : "Create Classroom"}
          </button>
        </div>
      </form>
    </div>
  );
}
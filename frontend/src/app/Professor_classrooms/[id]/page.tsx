"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

type ParamsType = Promise<{ id: string }>;

export default function CourseContent({ params }: { params: ParamsType }) {
  // ✅ unwrap params (Next.js 15+)
  const { id } = use(params);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [classData, setClassData] = useState<any>(null);

  // Content list
  const [contents, setContents] = useState<any[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  // Fetch class details
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

  // Fetch classroom content
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

  // Load contents when id changes
  useEffect(() => {
    fetchClassroomContent();
  }, [id]);

  // Handle PDF upload
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">🔄 Loading class content...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">❌ {error}</p>
      </div>
    );
  if (!classData)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No class data found.</p>
      </div>
    );

  // Main UI
  return (
    <div className="p-6">
      {/* Class Info */}
      <div>
        {classData.classroom_picture && (
          <img
            src={classData.classroom_picture}
            alt={classData.class_title}
            className="w-full max-w-lg rounded shadow"
          />
        )}
        <h1 className="text-2xl font-bold mt-4">
          {classData.class_title || "Untitled Course"}
        </h1>
        <span className="text-gray-500">{classData.class_field}</span>
        <p className="mt-2">Capacity: {classData.class_capacity}</p>
        <p className="mt-4">{classData.description}</p>
        <p className="mt-4 text-sm text-gray-500">
          Created on{" "}
          {new Date(classData.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at{" "}
          {new Date(classData.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Add Course Content Button */}
      <button
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        onClick={() => setShowModal(true)}
      >
        ➕ Add Course Content
      </button>

      {/* Course Content List */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">📂 Course Content</h2>
        {contents.length === 0 ? (
          <p className="text-gray-500">No content uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {contents.map((item) => (
              <li
                key={item.cloudinary_public_id}
                className="border p-3 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.filename}</p>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                  <p className="text-gray-400 text-xs">
                    Uploaded on {new Date(item.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(item.classroom_content_id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  📥 Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Upload PDF for {classData.class_title}
            </h2>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-3 w-full"
            />
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleUpload}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
              >
                Upload
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Classroom = {
  class_id: number;
  class_title: string;
  class_capacity: number;
  class_field: string;
  description: string;
  classroom_picture: string;
  classroom_password: string;
  created_at: string;
};

export default function StudentClasses() {
  const router = useRouter();
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refetch, setRefetch] = useState(false); // Add refetch state

  // Fetch available classes
  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/Student_login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/fetch_classrooms_for_students",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please log in again.");
            router.push("/Student_login");
            return;
          }
          const data = await response.json();
          throw new Error(data.detail || "Failed to fetch classes");
        }

        const data: Classroom[] = await response.json();
        setClasses(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong while fetching classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [router, refetch]); // Add refetch to dependencies

  // Handle enrollment
  const handleEnroll = async (classId: number) => {
    const password = prompt("Enter classroom password:");
    if (!password) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Student_login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/enroll_in_a_course",
        {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            class_id: classId,
            classroom_password: password
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to enroll");
      }

      const data = await response.json();
      setMessage(data.message || "Enrolled successfully!");
      setError("");
      setRefetch(prev => !prev); // Trigger refetch after successful enrollment
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong while enrolling.");
      setMessage("");
    }
  };

  if (loading) return <p>Loading classes...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Available Classes</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.class_id}
            className="border rounded-lg shadow-md overflow-hidden"
          >
            {cls.classroom_picture && (
              <img
                src={cls.classroom_picture}
                alt={cls.class_title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-classroom.jpg';
                }}
              />
            )}

            <div className="p-4">
              <h2 className="text-lg font-semibold">{cls.class_title}</h2>
              <p className="text-gray-600">{cls.description}</p>
              <p className="text-sm mt-2">
                <strong>Field:</strong> {cls.class_field}
              </p>
              <p className="text-sm">
                <strong>Capacity:</strong> {cls.class_capacity}
              </p>
              <p className="text-xs text-gray-500">
                Created at: {new Date(cls.created_at).toLocaleString()}
              </p>

              <button
                onClick={() => handleEnroll(cls.class_id)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Processing..." : "Enroll"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
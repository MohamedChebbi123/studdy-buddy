"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

type ClassDetail = {
  class_id: number;
  title: string;
  field: string;
  capacity: number;
  description: string;
  picture: string;
  created_at: string;
};

type ClassroomContent = {
  file: string;
  filecontent: string;
  description: string;
  upload_date: string;
};

export default function ClassDetailPage({ params }: { params: Promise<{ class_id: number }> }) {
  const { class_id } = use(params); 
  const router = useRouter();

  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [contentData, setContentData] = useState<ClassroomContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [errorContent, setErrorContent] = useState<string | null>(null);

  
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
        const response = await fetch(`http://localhost:8000/enrolled_classes/${class_id}`, {
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
        setClassData(data[0]);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchClassById();
  }, [class_id, router]);

  // Second endpoint: fetch classroom content
  useEffect(() => {
    const fetchClassroomContent = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorContent("Authentication required. Please log in.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/classroom_content/${class_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch classroom content");

        const data = await response.json();
        setContentData(data);
      } catch (err: any) {
        setErrorContent(err.message || "Something went wrong");
      } finally {
        setLoadingContent(false);
      }
    };

    fetchClassroomContent();
  }, [class_id]);

  if (loading) return <div>Loading class...</div>;
  if (error) return (
    <div>
      <h1>Error</h1>
      <p>{error}</p>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );

  if (!classData) return (
    <div>
      <h1>Class Not Found</h1>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );

  return (
    <div>
      <button onClick={() => router.back()}>{"<"} Back to Classes</button>

      {/* Class Details */}
      <div>
        <img src={classData.picture} alt={classData.title} />
        <h1>{classData.title}</h1>
        <p>{classData.field}</p>
        <h2>Description</h2>
        <p>{classData.description}</p>
        <h2>Class Information</h2>
        <p>Capacity: {classData.capacity} students</p>
        <p>Field: {classData.field}</p>
        <p>Class ID: #{classData.class_id}</p>
        <p>Created: {new Date(classData.created_at).toLocaleDateString()}</p>
      </div>

      {/* Classroom Content */}
      <div>
        <h2>Classroom Content</h2>
        {loadingContent ? (
          <p>Loading content...</p>
        ) : errorContent ? (
          <p style={{ color: "red" }}>{errorContent}</p>
        ) : contentData.length === 0 ? (
          <p>No content uploaded yet.</p>
        ) : (
          <ul>
            {contentData.map((content, idx) => (
              <li key={idx}>
                <p><strong>{content.file}</strong> - {content.description}</p>
                <p>Uploaded on: {new Date(content.upload_date).toLocaleDateString()}</p>
                <a href={content.filecontent} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

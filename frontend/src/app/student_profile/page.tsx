"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  academic_level: string;
  country: string;
  descritpion: string;
  joined_at: string;
};

export default function ViewProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

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

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Profile</h1>
      {profile && (
        <ul>
          <li><strong>First Name:</strong> {profile.first_name}</li>
          <li><strong>Last Name:</strong> {profile.last_name}</li>
          <li><strong>Email:</strong> {profile.email}</li>
          <li><strong>Phone Number:</strong> {profile.phone_number}</li>
          <li><strong>Academic Level:</strong> {profile.academic_level}</li>
          <li><strong>Country:</strong> {profile.country}</li>
          <li><strong>Description:</strong> {profile.descritpion}</li>
          <li><strong>Joined At:</strong> {new Date(profile.joined_at).toLocaleString()}</li>
        </ul>
      )}
    </div>
  );
}

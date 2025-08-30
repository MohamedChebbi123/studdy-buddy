"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiFile, FiCheck, FiX, FiLoader, FiBookOpen, FiEye, FiTrash2, FiDownload } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import NavBar from "@/components/NavBar";

type UploadedPdf = {
  id: string;
  filename: string;
  upload_date: string;
  file_size: number;
  analysis_status: string;
};

export default function PdfAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPdfs, setUploadedPdfs] = useState<UploadedPdf[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      router.push("/Student_login");
      return;
    }
    fetchUploadedPdfs();
  }, [router]);

  const fetchUploadedPdfs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/get_student_pdfs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setUploadedPdfs(data);
      }
    } catch (err) {
      console.error("Failed to fetch PDFs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError("");
        setMessage("");
      } else {
        setError("Please select a valid PDF file.");
        setFile(null);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError("");
        setMessage("");
      } else {
        setError("Please drop a valid PDF file.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login first.");
      router.push("/Student_login");
      return;
    }

    setIsUploading(true);
    setError("");
    setMessage("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload_student_pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(`Error: ${data.detail}`);
        return;
      }

      setSuccess(true);
      setMessage(data.message);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("pdf-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      // Refresh the uploaded PDFs list
      fetchUploadedPdfs();
    } catch (err) {
      setError("Something went wrong: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "processing":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="w-40 h-40 bg-gradient-to-br from-slate-200 to-blue-200 rounded-2xl mb-8 animate-bounce"></div>
          <div className="h-8 bg-gradient-to-r from-slate-200 to-blue-200 rounded-xl w-64 mb-4"></div>
          <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-80 mb-2"></div>
          <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-72"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
            <div className="relative bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-10 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl inline-block mb-6">
                  <FaFilePdf className="text-white text-4xl" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  PDF Analyzer
                </h1>
                <p className="text-blue-100 text-xl font-medium">
                  Upload and analyze your PDF documents with AI-powered insights
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-2 rounded-xl mr-3">
                  <FiUpload className="text-white text-lg" />
                </div>
                Upload PDF Document
              </h2>

              {/* Success Message */}
              {success && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl mb-6">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                      <FiCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-green-800 font-semibold">Upload successful!</p>
                      <p className="text-green-700 text-sm">{message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-4 rounded-xl mb-6">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg mr-3">
                      <FiX className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-red-800 font-semibold">{error}</p>
                  </div>
                </div>
              )}

              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-violet-400 bg-violet-50"
                    : file
                    ? "border-green-400 bg-green-50"
                    : "border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />

                <div className="space-y-4">
                  {file ? (
                    <>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl inline-block">
                        <FiFile className="text-white text-3xl" />
                      </div>
                      <div>
                        <p className="text-green-800 font-semibold text-lg">{file.name}</p>
                        <p className="text-green-600">{formatFileSize(file.size)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gradient-to-r from-slate-400 to-slate-500 p-4 rounded-2xl inline-block">
                        <FiUpload className="text-white text-3xl" />
                      </div>
                      <div>
                        <p className="text-slate-700 font-semibold text-lg">
                          Drag and drop your PDF here
                        </p>
                        <p className="text-slate-500">or click to browse</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" />
                    Upload PDF
                  </>
                )}
              </button>
            </div>

            {/* Uploaded PDFs Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl mr-3">
                  <FiBookOpen className="text-white text-lg" />
                </div>
                Your PDF Documents
              </h2>

              {uploadedPdfs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-slate-200 to-slate-300 p-6 rounded-2xl inline-block mb-4">
                    <FiFile className="text-slate-500 text-4xl" />
                  </div>
                  <p className="text-slate-600 text-lg">No PDF documents uploaded yet</p>
                  <p className="text-slate-500">Upload your first PDF to get started</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {uploadedPdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:bg-white/90 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1">
                          <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl mr-4 shadow-lg group-hover:shadow-xl transition-all duration-200">
                            <FaFilePdf className="text-white text-xl" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 text-lg mb-1">
                              {pdf.filename}
                            </h3>
                            <p className="text-slate-600 text-sm mb-2">
                              {formatFileSize(pdf.file_size)} • Uploaded on{" "}
                              {new Date(pdf.upload_date).toLocaleDateString()}
                            </p>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                pdf.analysis_status
                              )}`}
                            >
                              {pdf.analysis_status === "processing" && (
                                <FiLoader className="animate-spin mr-1" />
                              )}
                              {pdf.analysis_status === "completed" && (
                                <FiCheck className="mr-1" />
                              )}
                              {pdf.analysis_status === "failed" && (
                                <FiX className="mr-1" />
                              )}
                              {pdf.analysis_status}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/student_pdf/${pdf.id}`)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View Analysis"
                          >
                            <FiEye className="text-lg" />
                          </button>
                          <button
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="Download"
                          >
                            <FiDownload className="text-lg" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

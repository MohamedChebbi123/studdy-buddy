"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FiFileText, FiDownload, FiEye, FiBook, FiLoader, FiFolder } from "react-icons/fi"
import { FaFilePdf, FaGraduationCap } from "react-icons/fa"
import NavBar from "@/components/NavBar"

type Pdf = {
  pdf_id: number
  pdf_name: string
  pdffile: string
}

export default function PdfList() {
  const [pdfs, setPdfs] = useState<Pdf[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Authentication required. Please log in.")
      router.push("/Student_login")
      return
    }

    const fetchPdfs = async () => {
      try {
        const response = await fetch("http://localhost:8000/fetch_your_pdfs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch PDFs")
        }

        const data: Pdf[] = await response.json()
        setPdfs(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPdfs()
  }, [router])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="animate-pulse flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-2xl mb-8 animate-bounce flex items-center justify-center">
          <FiLoader className="text-4xl text-blue-600 animate-spin" />
        </div>
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
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
            <div className="relative bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-10 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
                <div className="flex items-center mb-6 lg:mb-0">
                  <div className="relative mr-8">
                    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-2xl ring-4 ring-white/20">
                      <FaFilePdf className="text-5xl text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
                      <FaGraduationCap className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Your PDF Library
                    </h1>
                    <p className="text-blue-100 text-xl font-medium">
                      Access and analyze your documents with AI
                    </p>
                    <div className="flex items-center justify-center lg:justify-start mt-4">
                      <span className="flex items-center text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <FiBook className="mr-2" /> 
                        {pdfs.length} Document{pdfs.length !== 1 ? 's' : ''} Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PDF List Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-10">
              {pdfs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-slate-200 to-blue-200 p-8 rounded-3xl inline-block mb-8">
                    <FiFolder className="text-6xl text-slate-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">No PDFs Found</h3>
                  <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    You haven't uploaded any PDF documents yet. Upload your first document to get started with AI-powered analysis.
                  </p>
                  <Link
                    href="/pdfanalyzer"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FiFileText className="mr-2 text-lg" />
                    Upload Your First PDF
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pdfs.map((pdf, index) => (
                    <div
                      key={pdf.pdf_id}
                      className="group bg-gradient-to-br from-white/70 to-slate-50/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {/* PDF Icon Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
                          <FaFilePdf className="text-2xl text-white" />
                        </div>
                        <div className="bg-gradient-to-r from-slate-100 to-blue-100 px-3 py-1 rounded-full">
                          <span className="text-xs font-semibold text-slate-600">
                            PDF #{pdf.pdf_id}
                          </span>
                        </div>
                      </div>

                      {/* PDF Name */}
                      <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {pdf.pdf_name}
                      </h3>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Link
                          href={`/student_pdf/${pdf.pdf_id}`}
                          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group/btn"
                        >
                          <FiEye className="mr-2 text-lg group-hover/btn:scale-110 transition-transform duration-200" />
                          View & Analyze
                        </Link>

                        {/* Download Button - Hidden for now as requested in comment */}
                        {/* <button
                          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <FiDownload className="mr-2 text-lg" />
                          Download
                        </button> */}
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upload New PDF Section */}
          {pdfs.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/pdfanalyzer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiFileText className="mr-2 text-lg" />
                Upload New PDF
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

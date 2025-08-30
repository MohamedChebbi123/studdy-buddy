"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FiFileText, FiDownload, FiMessageCircle, FiSend, FiBook, FiEye, FiArrowLeft, FiHash, FiCalendar } from "react-icons/fi"
import { FaRobot, FaUser } from "react-icons/fa"
import NavBar from "@/components/NavBar"

type ChunkedTextItem = {
  page: number
  page_content: string
}

type PdfResponse = {
  pdf_name: string
  pdf_content: string // base64
  chunked_text: ChunkedTextItem[]
}

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export default function PdfPage({ params }: { params: Promise<{ pdf_id: number }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ pdf_id: number } | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string>("")
  const [chunkedText, setChunkedText] = useState<ChunkedTextItem[]>([])
  const [chat, setChat] = useState<ChatMessage[]>([]) // chat history
  const [userInput, setUserInput] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params
        setResolvedParams(resolved)
      } catch (err) {
        setError("Failed to resolve parameters")
        setLoading(false)
      }
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!resolvedParams) return

    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentication required. Please log in.")
      router.push("/Student_login")
      return
    }

    let objectUrl: string | null = null

    const fetchPdf = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/view_pdf_by_id/${resolvedParams.pdf_id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (!response.ok) throw new Error("Failed to fetch PDF")

        const data: PdfResponse = await response.json()

        setPdfName(data.pdf_name)
        setChunkedText(data.chunked_text)

        // base64 → Blob
        const byteCharacters = atob(data.pdf_content)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: "application/pdf" })
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPdf()
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [resolvedParams, router])

  
  const sendMessage = async () => {
    if (!resolvedParams || !userInput.trim()) return
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentication required. Please log in.")
      router.push("/Student_login")
      return
    }

    const newMessage: ChatMessage = { role: "user", content: userInput }
    setChat((prev) => [...prev, newMessage])
    setUserInput("")
    setSending(true)

    try {
      const response = await fetch(
        `http://localhost:8000/view_pdf_by_id/${resolvedParams.pdf_id}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: newMessage.content }),
        }
      )

      if (!response.ok) throw new Error("Failed to get AI response")

      const data = await response.json()
      const aiMessage: ChatMessage = { role: "assistant", content: data.message }
      setChat((prev) => [...prev, aiMessage])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="w-40 h-40 bg-gradient-to-br from-slate-200 to-blue-200 rounded-2xl mb-8 animate-bounce flex items-center justify-center">
            <FiFileText className="text-slate-400 text-6xl" />
          </div>
          <div className="h-8 bg-gradient-to-r from-slate-200 to-blue-200 rounded-xl w-64 mb-4"></div>
          <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-80 mb-2"></div>
          <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-72"></div>
          <p className="text-slate-600 mt-4 font-medium">Loading your document...</p>
        </div>
      </div>
    </>
  )

  if (error) return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-2xl inline-block mb-6">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Document Error</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mr-6"
                  >
                    <FiArrowLeft className="mr-2" />
                    Back
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      PDF Document Viewer
                    </h1>
                    <div className="flex items-center space-x-4 text-blue-100">
                      <span className="flex items-center">
                        <FiHash className="mr-1 text-sm" />
                        Document ID: {resolvedParams?.pdf_id}
                      </span>
                      <span className="flex items-center">
                        <FiCalendar className="mr-1 text-sm" />
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      download={pdfName || `pdf_${resolvedParams?.pdf_id}.pdf`}
                      className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FiDownload className="mr-2 text-lg" />
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
            
            {/* Left Sidebar - Document Info & Chat */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Document Information Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-3 rounded-xl mr-4">
                    <FiFileText className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Document Info</h2>
                    <p className="text-slate-600 text-sm">File details and metadata</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
                    <p className="text-sm font-semibold text-slate-600 mb-1">Document Name</p>
                    <p className="font-bold text-blue-700 truncate">{pdfName || "Loading..."}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/50">
                    <p className="text-sm font-semibold text-slate-600 mb-1">Pages Available</p>
                    <p className="font-bold text-emerald-700">{chunkedText.length} pages</p>
                  </div>
                </div>
              </div>

              {/* Extracted Text Preview */}
              {chunkedText.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl mr-4">
                      <FiBook className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Text Preview</h3>
                      <p className="text-slate-600 text-sm">Extracted document content</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl max-h-64 overflow-y-auto border border-slate-200/50">
                    {chunkedText.map((chunk, index) => (
                      <div key={index} className="p-4 border-b border-slate-200/50 last:border-b-0 hover:bg-white/50 transition-colors">
                        <div className="flex items-center mb-3">
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Page {chunk.page}
                          </span>
                        </div>
                        <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed line-clamp-4">
                          {chunk.page_content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Chat Interface */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl mr-4">
                    <FiMessageCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">AI Assistant</h3>
                    <p className="text-slate-600 text-sm">Ask questions about your document</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl max-h-80 overflow-y-auto mb-4 p-4 border border-slate-200/50">
                  {chat.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaRobot className="text-white text-2xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-700 mb-2">Ready to Help!</h4>
                      <p className="text-slate-500 text-sm">Start by asking a question about your PDF document</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chat.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                              msg.role === "user"
                                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                                : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                            }`}
                          >
                            <div className="flex items-center mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                msg.role === "user" 
                                  ? "bg-white/20" 
                                  : "bg-gradient-to-r from-purple-500 to-pink-600"
                              }`}>
                                {msg.role === "user" ? (
                                  <FaUser className="text-white text-xs" />
                                ) : (
                                  <FaRobot className="text-white text-xs" />
                                )}
                              </div>
                              <span className={`text-xs font-semibold ${
                                msg.role === "user" ? "text-white/80" : "text-slate-500"
                              }`}>
                                {msg.role === "user" ? "You" : "AI Assistant"}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                    placeholder="Ask anything about this PDF..."
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !userInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <FiSend className="text-lg" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Viewer - Right Side */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 h-full overflow-hidden">
                {pdfUrl ? (
                  <div className="h-full flex flex-col">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                          <FiEye className="text-white text-lg" />
                        </div>
                        <div>
                          <span className="font-semibold text-lg">PDF Viewer</span>
                          <p className="text-slate-300 text-sm">{pdfName || "Document"}</p>
                        </div>
                      </div>
                      <div className="text-sm text-slate-300">
                        Interactive PDF Preview
                      </div>
                    </div>
                    <div className="flex-1">
                      <iframe 
                        src={pdfUrl} 
                        className="w-full h-full border-0" 
                        title="PDF Viewer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="text-center p-12">
                      <div className="bg-gradient-to-r from-slate-400 to-blue-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <FiFileText className="text-white text-4xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-700 mb-4">Preparing Document</h3>
                      <p className="text-slate-500 max-w-md">Your PDF is being processed and will appear here shortly. Please wait a moment...</p>
                      <div className="mt-6">
                        <div className="animate-pulse flex space-x-2 justify-center">
                          <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

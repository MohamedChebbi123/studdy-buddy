"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
export default function StudentLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router=useRouter()
    const handleSubmit = async (e:any) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("http://localhost:8000/login_student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.detail || "Login failed")
            }

            const data = await res.json()
            localStorage.setItem("token", data.token);
            alert(data.message)
            router.push("/student_profile")


        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unknown error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
            <h2 className="text-xl font-bold">Student Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 rounded"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    )
}

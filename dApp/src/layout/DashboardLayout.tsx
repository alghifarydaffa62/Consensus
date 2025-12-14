import { Outlet, useNavigate } from "react-router-dom"
import { useConnection } from "wagmi"
import { useEffect } from "react"
import Sidebar from "../component/Sidebar"

export default function DashboardLayout() {
    const { isConnected } = useConnection()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isConnected) {
            navigate('/') 
        }
    }, [isConnected, navigate])

    if (!isConnected) return null; 

    return(
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="ml-64 w-[calc(100%-16rem)] min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet /> 
                </div>
            </main>
        </div>
    )
}
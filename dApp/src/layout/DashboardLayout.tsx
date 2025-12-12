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
        <div className="flex justify-center gap-20  bg-gray-50">
            <Sidebar />

            <div className="p-5 w-[55vw]">
                <Outlet /> 
            </div>
        </div>
    )
}
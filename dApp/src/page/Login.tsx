import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import metamask from "../assets/MetaMask.svg"
import { useConnect, useConnections, useConnectors } from "wagmi"
import Navbar from "../component/Navbar"

export default function Login() {
    const connectors = useConnectors() 

    const { mutate, status: connectStatus } = useConnect()

    const connections = useConnections()
    
    const navigate = useNavigate()

    useEffect(() => {
        if (connections.length > 0) {
            navigate('/dashboard');
        }
    }, [connections, navigate])

    const handleLogin = () => {
        const metaMaskConnector = connectors.find((c) => 
            c.name === 'MetaMask' || c.id === 'io.metamask'
        )

        if (metaMaskConnector) {
            mutate({ connector: metaMaskConnector })
        } else {
            const injected = connectors.find((c) => c.id === 'injected')
            if (injected) {
                mutate({ connector: injected })
            } else {
                alert("MetaMask Not Installed!")
            }
        }
    }

    return(
        <div>
            <Navbar/>
            <h1 className="text-center text-3xl font-semibold">Please connect your wallet</h1>

            {connectStatus === 'pending' && (
                <p className="text-amber-600 font-medium animate-pulse">Connecting to Wallet...</p>
            )}

            <button 
                onClick={handleLogin} 
                disabled={connectStatus === 'pending'}
                className="cursor-pointer flex justify-center gap-4 p-4 rounded-lg items-center bg-amber-600 w-fit hover:bg-amber-700 transition-all disabled:opacity-50"
            >
                <h1 className="text-xl font-semibold text-white">Connect With Metamask</h1>
                <img src={metamask} alt="" className="w-8"/>
            </button>
        </div>
    )
}
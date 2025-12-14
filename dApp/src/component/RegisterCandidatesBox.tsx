import { useState, useEffect } from "react"
import { useRegisterCandidates } from "../hooks/useRegisterCandidates"
import { Loader2, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { isAddress } from "viem";

export default function RegisterCandidatesBox({ contractAddress }: { contractAddress: string }) {
    const [candidateAddr, setCandidateAddr] = useState("")
    const { register, isLoading, isSuccess, error} = useRegisterCandidates(contractAddress)
    
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()

        if(!isAddress(candidateAddr)) {
            return alert("Address Invalid!")
        }

        register(candidateAddr)
    }

    useEffect(() => {
        if(isSuccess) {
            setCandidateAddr("")
        }
    }, [isSuccess])

    return(
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-amber-600" />
                Daftarkan Kandidat
            </h3>

            <form onSubmit={handleRegister} className="flex gap-3">
                <input 
                    type="text" 
                    value={candidateAddr} 
                    onChange={(e) => setCandidateAddr(e.target.value)}
                    placeholder="0xAddressKandidat..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition disabled:bg-gray-100"
                    disabled={isLoading}
                />
                
                <button 
                    type="submit"
                    disabled={isLoading || !candidateAddr}
                    className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Add"}
                </button>
            </form>

            {/* Feedback UI */}
            {isSuccess && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                    <CheckCircle size={16} />
                    <span>Candidate registration succeed!</span>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2 animate-fade-in break-all">
                    <AlertCircle size={16} className="mt-0.5 min-w-4" />
                    <span>Error: {(error as any).shortMessage || error.message}</span>
                </div>
            )}
        </div>
    )
}
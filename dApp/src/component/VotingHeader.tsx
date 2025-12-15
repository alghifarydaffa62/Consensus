import { User, Clock, UserPlus, Play } from "lucide-react"
import { VotingHeaderProps } from "../types";
import { useState } from "react";
import Modal from "./Modal";
import RegisterCandidatesBox from "./RegisterCandidatesBox";
import RegisterVotersBox from "./RegisterVotersBox";
import { useConnection } from "wagmi";

export default function VotingHeader({ details }: VotingHeaderProps) {
    const { address } = useConnection()
    const isOwner = address && details.owner && address.toLowerCase() === details.owner.toLowerCase();

    const [activeModal, setActiveModal] = useState<"candidate" | "voter" | "start" | null>(null)
    
    const closeModal = () => setActiveModal(null)
    
    return(
        <>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-2xl">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {details.metadata?.title || "Judul Tidak Tersedia"}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                <User size={14} /> Owner: {details.owner.slice(0,6)}...{details.owner.slice(-4)}
                            </span>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold ${
                                details.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                details.status === 'Closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {details.status}
                            </span>
                        </div>
                    </div>

                    {details.status === 'Active' && (
                        <div className="text-right">
                            <p className="text-sm text-gray-400 mb-1 flex items-center justify-end gap-1">
                                <Clock size={14}/> Sisa Waktu
                            </p>
                            <p className="text-2xl font-mono font-bold text-amber-600">
                                {Number(details.remainingTime) > 0 ? (Number(details.remainingTime) / 60).toFixed(0) + " Menit" : "Berakhir"}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {details.metadata?.desc || "Tidak ada deskripsi."}
                    </p>
                </div>

                {details.status === 'Pending' && isOwner && (
                    <div className="mt-8 flex gap-3">
                        <button 
                            onClick={() => setActiveModal("voter")}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition border border-blue-100"
                        >
                            <UserPlus size={18} /> Register Voter
                        </button>
                        
                        <button 
                            onClick={() => setActiveModal("candidate")}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100 transition border border-amber-100"
                        >
                            <UserPlus size={18} /> Register Candidate
                        </button>
                        
                        <button 
                            onClick={() => setActiveModal("start")}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-sm hover:shadow-md ml-auto"
                        >
                            <Play size={18} /> Start Voting
                        </button>
                    </div>
                )}
            </div>

            <Modal 
                isOpen={activeModal === "voter"} 
                onClose={closeModal} 
                title="Register Participant of this vote"
            >
                <RegisterVotersBox contractAddress={details.address}/>
            </Modal>
            <Modal 
                isOpen={activeModal === "candidate"} 
                onClose={closeModal} 
                title="Register Candidate of this vote"
            >
                <RegisterCandidatesBox contractAddress={details.address} />
            </Modal>
        </>
    )
}
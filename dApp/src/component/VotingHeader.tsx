import { User, Clock } from "lucide-react"
import { VotingDetails } from "../hooks/useVotingDetails"

interface VotingHeaderProps {
    details: VotingDetails; 
}

export default function VotingHeader({ details }: VotingHeaderProps) {
    return(
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
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
                
                {/* Timer Countdown */}
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

            {details.status == 'Pending' && (
                <div className="mt-10 flex gap-3">
                    <button className="p-3 rounded-md bg-blue-500 font-semibold">Register Voter</button>
                    <button className="p-3 rounded-md bg-amber-500 font-semibold">Register Candidate</button>
                    <button className="p-3 rounded-md bg-green-500 font-semibold">Start Voting</button>
                </div>
            )}
        </div>
    )
}
import { Voting } from "../types";
import { fetchIPFSData } from "../utils/fetchIPFSData";
import { Link } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react";

export default function VotingCard({ voting }: {voting: Voting} ) {
    const [loading, setLoading] = useState(false)
    const [metadata, setMetadata] = useState<{title: string, desc: string} | null>(null)

    useEffect(() => {
        const load = async () => {
            setLoading(true)

            try {
                const data = await fetchIPFSData(voting.metadataURI)
                setMetadata(data)
            } catch(error) {
                console.error("Error fetching metadata: ", error)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [voting.metadataURI])
    
    const now = Math.floor(Date.now() / 1000)
    let statusColor = "bg-gray-100 text-gray-600";
    let statusText = "Draft";

    if (voting.isVotingStarted) {
        if (now < Number(voting.votingEndTime)) {
            statusColor = "bg-green-100 text-green-700";
            statusText = "Active";
        } else {
            statusColor = "bg-red-100 text-red-700";
            statusText = "Ended";
        }
    } else {
        statusColor = "bg-yellow-100 text-yellow-700";
        statusText = "Pending Start";
    }

    return (
        <div className="bg-white border w-md border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                    {statusText}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                    {voting.address.slice(0, 6)}...{voting.address.slice(-4)}
                </span>
            </div>

            <div className="flex-1 mb-6">
                {loading ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading info...
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2" title={metadata?.title}>
                            {metadata?.title || "Judul Tidak Tersedia"}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3">
                            {metadata?.desc || metadata?.desc || "Deskripsi tidak tersedia."}
                        </p>
                    </>
                )}
            </div>

            <Link 
                to={`/dashboard/vote/${voting.address}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:text-amber-600 transition-colors"
            >
                Manage / View <ArrowRight size={16} />
            </Link>
        </div>
    )
}
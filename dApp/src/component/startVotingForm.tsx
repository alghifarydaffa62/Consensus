import { useState, useEffect } from "react";
import { useStartVoting } from "../hooks/useStartVoting";
import { Loader2, Play, AlertCircle, CheckCircle, CalendarClock } from "lucide-react";

export default function StartVotingForm({ contractAddress }: { contractAddress: string }) {
    const [endTime, setEndTime] = useState("")
    const {
        startVoting,
        isLoading,
        isSuccess,
        error,
    } = useStartVoting(contractAddress)

    const handleSubmit = () => {
        if (!endTime) return alert("EndTime Required!");

        const dateObj = new Date(endTime)
        startVoting(dateObj)
    }

    useEffect(() => {
        if (isSuccess) setEndTime("");
    }, [isSuccess]);

    return(
        <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <CalendarClock className="text-amber-600 w-6 h-6 shrink-0" />
                <div>
                    <h4 className="text-sm font-bold text-amber-800">Tentukan Deadline</h4>
                    <p className="text-xs text-amber-700 mt-1">
                        After voting is started you <b>can't</b> register candidates / voters anymore. Make sure you're ready!
                    </p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voting End Time
                </label>
                <input 
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition cursor-pointer"
                    disabled={isLoading}
                />
            </div>

            <button 
                onClick={handleSubmit}
                disabled={isLoading || !endTime}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                        <Play size={18} fill="currentColor" /> Start Voting
                    </>
                )}
            </button>

            {isSuccess && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span>Voting has successfully started</span>
                </div>
            )}
            
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2 break-all">
                    <AlertCircle size={16} className="mt-0.5 min-w-4" />
                    <span>Error: {(error as any).shortMessage || error.message}</span>
                </div>
            )}
        </div>
    )
}
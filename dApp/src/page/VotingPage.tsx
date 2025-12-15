import { useParams } from "react-router-dom"
import { useVotingDetails } from "../hooks/useVotingDetails"
import { Loader2 } from "lucide-react";
import VotingHeader from "../component/VotingHeader";
import VotingCandidates from "../component/VotingCandidates";
import VotingVoters from "../component/VotingVoters";

export default function VotingPage() {
    const { address } = useParams()
    const { details, isLoading } = useVotingDetails(address!)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                <p className="mt-4 text-gray-500">Memuat data voting...</p>
            </div>
        );
    }

    if (!details) {
        return <div className="text-center p-10 text-red-500">Voting tidak ditemukan atau error loading.</div>;
    }

    return(
        <div>
            <div className="flex gap-5">
                <VotingHeader details={details}/>

                <div className="w-fit">
                    <VotingCandidates details={details}/>
                </div>
            </div>

            <div className="w-fit mt-5">
                <VotingVoters details={details}/>
            </div>
        </div>
        
    )
}
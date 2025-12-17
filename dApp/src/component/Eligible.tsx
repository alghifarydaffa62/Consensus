import { useEligibleVoting } from "../hooks/useEligibleVoting";
import VotingCard from "./VotingCard";
import { Loader2, Vote } from "lucide-react";

export default function Eligible() {
    const { votings, isLoading } = useEligibleVoting()

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-amber-500" />
                <p>Fetching eligible votes....</p>
            </div>
        );
    }

    return(
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Vote className="text-amber-600" />
                    Eligible Votes
                </h1>
                <p className="text-gray-500">
                    Voting list where you are registered as a <b>Voter</b> or <b>Candidate</b>.
                </p>
            </div>

            {votings.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">
                        You are not assigned in any votes
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {votings.map((vote) => (
                        <VotingCard key={vote.address} voting={vote} />
                    ))}
                </div>
            )}
        </div>
    )
}
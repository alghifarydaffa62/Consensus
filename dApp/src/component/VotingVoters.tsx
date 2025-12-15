import { VotingDetails } from "../hooks/useVotingDetails"

interface VotingVotersProps {
    details: VotingDetails;
}

export default function VotingVoters({ details }: VotingVotersProps) {
    const voters = details.voters || []

    if (voters.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">There is no voter registered yet</p>
            </div>
        );
    }

    return(
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1>All of the participant of this voting</h1>

            {voters.map((voter, index) => (
                <div key={index}>
                    <h1>{voter.address.slice(0, 10)}...{voter.address.slice(-5)}</h1>
                </div>
            ))}
        </div>
    )
}
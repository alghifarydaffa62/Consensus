import { VotingDetails } from "../hooks/useVotingDetails"

interface VotingVotersProps {
    details: VotingDetails;
}
export default function VotingVoters({ details }: VotingVotersProps) {
    return(
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1>All of the participant of this voting</h1>
        </div>
    )
}
import { VotingDetails } from "../hooks/useVotingDetails"

interface VotingCandidatesProps {
    details: VotingDetails;
}

export default function VotingCandidates({ details }: VotingCandidatesProps) {

    const candidates = details.candidates || [];

    if (candidates.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">Belum ada kandidat yang terdaftar.</p>
            </div>
        );
    }
    return(
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1>Candidates of this Vote</h1>

            
            <ul>
                {candidates.map((candidate, index) => (
                    <div key={index}>
                        <h1>{candidate.address.slice(0, 6)}...{candidate.address.slice(-4)}</h1>
                    </div>
                ))}
            </ul>
        </div>
    )
}
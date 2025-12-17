import { ReactNode } from "react";

export interface Candidate {
    id: string;
    address: string;
    voteCount: string;
}

export interface Voter {
    address: string;
    votedCandidate: string;
}

export interface VotingDetails {
    address: string;
    metadataURI: string;
    metadata: { title: string; desc: string } | null;
    status: string;
    candidates: Candidate[];
    voters: Voter[];
    remainingTime: bigint;
    owner: string;
}

export interface Voting {
    address: string;
    metadataURI: string;
    isVotingStarted: boolean;
    votingEndTime: bigint;
    owner: string;
    userRole?: "Owner" | "Candidate" | "Voter";
}

export interface VotingCandidatesProps {
    details: VotingDetails;
}

export interface VotingVotersProps {
    details: VotingDetails;
}

export interface VotingHeaderProps {
    details: VotingDetails; 
}

export interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    children: ReactNode
}
import { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import VotingABI from "../abi/Voting.json";
import { fetchIPFSData } from "../utils/fetchIPFSData";
import { useConfig } from "wagmi";

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

export function useVotingDetails(address: string) {
    const [details, setDetails] = useState<VotingDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const config = useConfig();

    useEffect(() => {
        if(!address) return

        const loadData = async () => {
            setIsLoading(true)
            try {
                const metadataURI = await readContract(config, {
                    address: address as `0x${string}`,
                    abi: VotingABI.abi,
                    functionName: "metadataURI"
                })

                const metadataJSON = await fetchIPFSData(metadataURI as string)

                const status = await readContract(config, {
                    address: address as `0x${string}`,
                    abi: VotingABI.abi,
                    functionName: "getVotingStatus"
                })

                const remainingTime = await readContract(config, {
                    address: address as `0x${string}`,
                    abi: VotingABI.abi,
                    functionName: "getRemainingTime"
                })

                const owner = await readContract(config, {
                    address: address as `0x${string}`,
                    abi: VotingABI.abi,
                    functionName: "owner"
                })

                const loadedCandidates: Candidate[] = []
                let index = 0;
                let keepFetching = true;

                while(keepFetching) {
                    try {
                        const candidates = await readContract(config, {
                            address: address as `0x${string}`,
                            abi: VotingABI.abi,
                            functionName: "candidateAddresses",
                            args: [BigInt(index)]
                        }) as string

                        const candidateStruct = await readContract(config, {
                            address: address as `0x${string}`,
                            abi: VotingABI.abi,
                            functionName: "candidates",
                            args: [candidates]
                        }) as [bigint, bigint, boolean]

                        loadedCandidates.push({
                            id: candidateStruct[0].toString(),
                            address: candidates,
                            voteCount: candidateStruct[1].toString()
                        })

                        index++
                    } catch(error) {
                        console.error("error fetching voting details: ", error)
                        keepFetching = false
                    }
                }

                const loadedVoter: Voter[] = []
                let voterIndex = 0;
                let fetchVoter = true;

                while(fetchVoter) {
                    try {
                        const voters = await readContract(config, {
                            address: address as `0x${string}`,
                            abi: VotingABI.abi,
                            functionName: "voterAddresses",
                            args: [BigInt(voterIndex)]
                        }) as string

                        const voterStruct = await readContract(config, {
                            address: address as `0x${string}`,
                            abi: VotingABI.abi,
                            functionName: "voters",
                            args: [voters]
                        }) as [bigint, boolean, boolean]

                        loadedVoter.push({
                            address: voters,
                            votedCandidate: voterStruct[2].toString()
                        })

                        voterIndex++
                    } catch(error) {
                        console.error("error fetching voters: ", error)
                        fetchVoter = false
                    }
                }

                setDetails({
                    address,
                    metadataURI: metadataURI as string,
                    metadata: metadataJSON,
                    status: status as string,
                    candidates: loadedCandidates,
                    voters: loadedVoter,
                    remainingTime: remainingTime as bigint,
                    owner: owner as string
                })

            } catch(error) {
                console.error("Error fetching voting details: ", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        loadData()
    }, [address])
    return { details, isLoading }
}

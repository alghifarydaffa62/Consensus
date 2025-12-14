import { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import VotingABI from "../abi/Voting.json";
import { fetchIPFSData } from "../utils/fetchIPFSData";
import { useConfig } from "wagmi";

export interface VotingDetails {
    address: string;
    metadataURI: string;
    metadata: { title: string; desc: string } | null;
    status: string;
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

                const metadataJSON = await fetchIPFSData(metadataURI as string)

                setDetails({
                    address,
                    metadataURI: metadataURI as string,
                    metadata: metadataJSON,
                    status: status as string,
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

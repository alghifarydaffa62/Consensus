import { useReadContract, useConnection, useConfig } from "wagmi";
import VotingFactoryABI from "../abi/VotingFactory.json"
import VotingABI from "../abi/Voting.json"
import { useState, useEffect} from "react"
import { readContract } from "wagmi/actions";
import { Voting } from "../types";

const FACTORY_ADDRESS = import.meta.env.VITE_VOTING_FACTORY

export function useMyCampaigns() {
    const { address: userAddress } = useConnection()
    const [campaigns, setCampaigns] = useState<Voting[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const config = useConfig()

    const { data: votingAddresses, isError, error } = useReadContract({
        address: FACTORY_ADDRESS,
        abi: VotingFactoryABI.abi,
        functionName: "getDeployedVotings"
    })

    useEffect(() => {
        const fetchDetails = async () => {
            if (!votingAddresses || !userAddress) return;

            setIsLoading(true)
            const allCampaigns: Voting[] = []

            try {
                for(const voteAddr of (votingAddresses as string[])) {
                    const owner = await readContract(config, {
                        address: voteAddr as `0x${string}`,
                        abi: VotingABI.abi,
                        functionName: "owner"
                    })

                    if((owner as string).toLowerCase() === userAddress.toLowerCase()) {
                        const metadataURI = await readContract(config, {
                            address: voteAddr as `0x${string}`,
                            abi: VotingABI.abi,
                            functionName: "metadataURI"
                        })

                        const isVotingStarted = await readContract(config, {
                            address: voteAddr as `0x${string}`,
                            abi: VotingABI.abi,
                            functionName: "isVotingStarted"
                        })

                        const votingEndTime = await readContract(config, {
                            address: voteAddr as `0x${string}`,
                            abi: VotingABI.abi,
                            functionName: "votingEndTime"
                        })

                        allCampaigns.push({
                            address: voteAddr,
                            metadataURI: metadataURI as string,
                            isVotingStarted: isVotingStarted as boolean,
                            votingEndTime: votingEndTime as bigint,
                            owner: owner as string
                        })
                    }
                }
                setCampaigns(allCampaigns)
            } catch(error) {
                console.error("error fetching campaigns: ", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDetails()
    }, [votingAddresses, userAddress])

    return { campaigns, isLoading, isError };
}
 
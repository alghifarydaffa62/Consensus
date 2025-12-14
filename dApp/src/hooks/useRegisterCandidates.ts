import VotingABI from "../abi/Voting.json"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"

export function useRegisterCandidates(contractAddress: string) {
    const {
        data: hash,
        writeContract,
        isPending: isWritePending, 
        error: writeError
    } = useWriteContract()

    const {
        isLoading: isConfirming,
        isSuccess
    } = useWaitForTransactionReceipt({ hash })

    const register = async (candidateAddress: string) => {
        writeContract({
            address: contractAddress as `0x${string}`,
            abi: VotingABI.abi,
            functionName: "registerCandidate",
            args: [candidateAddress]
        })
    }

    return {
        register,
        isLoading: isWritePending || isConfirming,
        isSuccess,
        error: writeError,
        txHash: hash
    }
}
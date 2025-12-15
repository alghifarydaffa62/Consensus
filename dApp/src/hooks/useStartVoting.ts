import VotingABI from "../abi/Voting.json"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export function useStartVoting(contractAddress: string) {
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

    const startVoting = (endDate: Date) => {
        if (!contractAddress) return;

        if(endDate.getTime() <= Date.now()) {
            alert("Tanggal selesai harus di masa depan!");
            return;
        }

        const endTimestamp = Math.floor(endDate.getTime() / 1000)

        writeContract({
            address: contractAddress as `0x${string}`,
            abi: VotingABI.abi,
            functionName: "startVoting",
            args: [BigInt(endTimestamp)]
        })
    }

    return {
        startVoting,
        isLoading: isWritePending || isConfirming,
        isSuccess,
        error: writeError,
        txHash: hash
    };
}
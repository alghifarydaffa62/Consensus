import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import VotingABI from "../abi/Voting.json"
import { isAddress } from "viem"

export function useRegisterVoters(contractAddress: string) {
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

    const registerVoter = async (voterAddress: string[]) => {
        const validAddresses = voterAddress.filter(addr => isAddress(addr))

        if (validAddresses.length === 0) {
            alert("All Address Invalid!");
            return;
        }

        if (validAddresses.length !== voterAddress.length) {
            const invalidCount = voterAddress.length - validAddresses.length;
            if(!confirm(`Ada ${invalidCount} alamat tidak valid yang akan di-skip. Lanjut?`)) {
                return;
            }
        }

        writeContract({
            address: contractAddress as `0x${string}`,
            abi: VotingABI.abi,
            functionName: "registerVoterBatch",
            args: [validAddresses]
        })
    }

    return {
        registerVoter,
        isLoading: isWritePending || isConfirming,
        isSuccess,
        error: writeError,
        txHash: hash
    }
}
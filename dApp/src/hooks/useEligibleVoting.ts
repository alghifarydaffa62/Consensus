import { useState, useEffect } from "react";
import { useReadContract, useConnection, useConfig } from "wagmi";
import { readContract } from "wagmi/actions";
import VotingFactoryABI from "../abi/VotingFactory.json";
import VotingABI from "../abi/Voting.json";
import { Voting } from "../types"; 

// GANTI DENGAN ALAMAT FACTORY YANG BENAR
const FACTORY_ADDRESS = import.meta.env.VITE_VOTING_FACTORY; 

export function useEligibleVoting() {
  const { address: userAddress } = useConnection();
  const [votings, setVotings] = useState<Voting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const config  = useConfig()
  // 1. Ambil semua alamat voting
  const { data: votingAddresses } = useReadContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: VotingFactoryABI.abi,
    functionName: "getDeployedVotings",
  });

  useEffect(() => {
    const fetchEligible = async () => {
      if (!votingAddresses || !userAddress) return;
      
      setIsLoading(true);
      const eligibleList: Voting[] = [];

      try {
        for (const voteAddr of (votingAddresses as string[])) {
          
          // A. Cek Owner
          const owner = await readContract(config, {
            address: voteAddr as `0x${string}`,
            abi: VotingABI.abi,
            functionName: "owner",
          }) as string;

          let myRole: "Owner" | "Voter" | "Candidate" | "Public" = "Public";

          if (owner.toLowerCase() === userAddress.toLowerCase()) {
             myRole = "Owner";
          } else {
             // B. Cek Voter
             const voterInfo = await readContract(config, {
                address: voteAddr as `0x${string}`,
                abi: VotingABI.abi,
                functionName: "voters",
                args: [userAddress],
             }) as [bigint, boolean, boolean];
             
             if (voterInfo[2]) myRole = "Voter"; // isRegistered

             // C. Cek Kandidat (Jika belum terdeteksi sbg Voter)
             // (Seorang user bisa jadi Voter SEKALIGUS Kandidat, prioritas tampilan terserah kamu)
             if (myRole === "Public" || myRole === "Voter") {
                 const candidateInfo = await readContract(config, {
                    address: voteAddr as `0x${string}`,
                    abi: VotingABI.abi,
                    functionName: "candidates",
                    args: [userAddress],
                 }) as [bigint, bigint, boolean];

                 if (candidateInfo[2]) myRole = "Candidate";
             }
          }

          // D. KEPUTUSAN: Jika punya Role (Bukan Public), masukkan ke list
          if (myRole !== "Public") {
            
            const metadataURI = await readContract(config, {
              address: voteAddr as `0x${string}`,
              abi: VotingABI.abi,
              functionName: "metadataURI",
            });

            const isVotingStarted = await readContract(config, {
              address: voteAddr as `0x${string}`,
              abi: VotingABI.abi,
              functionName: "isVotingStarted",
            });

            const votingEndTime = await readContract(config, {
              address: voteAddr as `0x${string}`,
              abi: VotingABI.abi,
              functionName: "votingEndTime",
            });

            eligibleList.push({
              address: voteAddr,
              metadataURI: metadataURI as string,
              isVotingStarted: isVotingStarted as boolean,
              votingEndTime: votingEndTime as bigint,
              owner: owner,
              userRole: myRole // <--- KITA SIMPAN DI SINI
            });
          }
        }
        setVotings(eligibleList);
      } catch (err) {
        console.error("Gagal fetch eligible campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEligible();
  }, [votingAddresses, userAddress]);

  return { votings, isLoading };
}
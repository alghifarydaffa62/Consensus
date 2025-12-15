import { useState, useEffect } from "react"
import { useRegisterVoters } from "../hooks/useRegisterVoters"
import { Loader2, Users, CheckCircle, AlertCircle, X, Plus } from "lucide-react";
import { isAddress } from "viem";

export default function RegisterVotersBox({ contractAddress }: { contractAddress: string }) {
    const [voterList, setVoterList] = useState<string[]>([])
    const [inputValue, setInputValue] = useState("")

    const {registerVoter, isLoading, isSuccess, error, txHash} = useRegisterVoters(contractAddress)

    const handleAdd = async () => {
        if (!inputValue.trim()) return;

        const rawAddresses = inputValue.split(/[\n,\s]+/).map(addr => addr.trim()).filter(Boolean);

        const validAddresses: string[] = []
        const invalidAddresses: string[] = []

        rawAddresses.forEach(addr => {
            if(isAddress(addr)) {
                if (!voterList.includes(addr)) {
                    validAddresses.push(addr);
                }
            } else {
                invalidAddresses.push(addr)
            }
        })

        setVoterList(prev => [...prev, ...validAddresses])
        setInputValue("")

        if (invalidAddresses.length > 0) {
            alert(`${invalidAddresses.length} alamat tidak valid diabaikan.`);
        }
    }

    const removeAddress = (indexToRemove: number) => {
        setVoterList(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmit = () => {
        if (voterList.length === 0) return alert("Daftar pemilih kosong!");
        registerVoter(voterList);
    }

    useEffect(() => {
        if (isSuccess) {
            setVoterList([]);
        }
    }, [isSuccess]);

    return(
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tambah Alamat Pemilih</label>
                <div className="flex gap-2">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Paste alamat di sini (bisa banyak sekaligus, pisahkan dengan koma atau enter)..."
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-mono h-24 resize-none"
                    />
                    <button 
                        onClick={handleAdd}
                        disabled={!inputValue}
                        className="bg-gray-100 text-gray-700 px-4 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 transition flex flex-col items-center justify-center gap-1 min-w-20"
                    >
                        <Plus size={20} />
                        <span className="text-xs">Add</span>
                    </button>
                </div>
                <p className="text-xs text-gray-400">Tips: Anda bisa copy-paste daftar alamat dari Excel langsung ke sini.</p>
            </div>

            {voterList.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Users size={16} /> Daftar Siap Upload ({voterList.length})
                        </h4>
                        <button 
                            onClick={() => setVoterList([])} 
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {voterList.map((addr, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100 text-xs shadow-sm animate-fade-in">
                                <span className="font-mono text-gray-600 truncate w-[90%]">{addr}</span>
                                <button onClick={() => removeAddress(idx)} className="text-gray-400 hover:text-red-500">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button 
                onClick={handleSubmit}
                disabled={isLoading || voterList.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : "Register All Voters to Blockchain"}
            </button>

            {isSuccess && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span>Sukses! Semua pemilih berhasil didaftarkan.</span>
                </div>
            )}
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2 break-all">
                    <AlertCircle size={16} className="mt-0.5 min-w-4" />
                    <span>Error: {(error as any).shortMessage || error.message}</span>
                </div>
            )}
        </div>
    )
}
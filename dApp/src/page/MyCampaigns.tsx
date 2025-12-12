import { useMyCampaigns } from "../hooks/useMyCampaigns";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import VotingCard from "../component/VotingCard";

export default function MyCampaigns() {
    const { campaigns, isLoading, isError } = useMyCampaigns()

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-amber-500" />
                <p>Fetching data...</p>
            </div>
        );
    }

    if(isError) {
        console.error("Error: ", isError)
    }

    return(
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Campaigns</h1>
                    <p className="text-gray-500">Daftar voting yang Anda buat sebagai admin.</p>
                </div>
                <Link to="/dashboard/create" className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition">
                    + Buat Baru
                </Link>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">Anda belum membuat voting apapun.</p>
                    <Link to="/dashboard/create" className="text-amber-600 font-bold hover:underline">
                        Buat voting pertama Anda sekarang
                    </Link>
                </div>
            ) : (
                <div className="flex gap-10">
                    {campaigns.map((camp) => (
                        <VotingCard key={camp.address} voting={camp} />
                    ))}
                </div>
            )}
        </div>
    )
}
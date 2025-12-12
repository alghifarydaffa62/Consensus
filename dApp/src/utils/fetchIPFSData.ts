import { useState, useEffect } from "react";

export const fetchIPFSData = (ipfsURI: string) => {
    const [data, setData] = useState<{title: string, desc: string} | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ipfsURI) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const cid = ipfsURI.replace("ipfs://", "");
                const url = `https://rose-blank-vicuna-66.mypinata.cloud/ipfs/${cid}`;
                
                const res = await fetch(url);
                if (!res.ok) throw new Error("error fetching ipfs data");
                
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                console.error("IPFS Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ipfsURI])

    return { data, loading, error};
}
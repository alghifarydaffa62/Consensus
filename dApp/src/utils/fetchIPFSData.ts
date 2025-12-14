
export const fetchIPFSData = async (ipfsURI: string) => {
    if (!ipfsURI) return null; 

    try {
        const cid = ipfsURI.replace("ipfs://", "");
        const url = `https://rose-blank-vicuna-66.mypinata.cloud/ipfs/${cid}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("error fetching ipfs data");
        
        const json = await res.json();

        return json as { title: string, desc: string }; 

    } catch (err) {
        console.error("IPFS Fetch Error:", err);
        return null; 
    }
}
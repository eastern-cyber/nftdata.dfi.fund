export interface Erc1155Transaction {
    transactionHash: string;
    blockNumber: string;
    from: string;
    to: string;
    tokenID: string;
    timeStamp: string;
  }
  
  export const fetchErc1155Transactions = async (contractAddress: string, apiKey: string): Promise<Erc1155Transaction[]> => {
    // const url = `https://api.polygonscan.com/api?module=account&action=tokennfttx&contractaddress=${contractAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
    const url = `https://api.polygonscan.com/api?module=account&action=tokennfttx&contractaddress=0x2a61627c3457ccea35482cadec698c7360ffb9f2&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status !== "1") {
        console.error("Error fetching data:", data.message);
        return [];
      }
  
      return data.result.map((tx: any) => ({
        transactionHash: tx.hash,
        blockNumber: tx.blockNumber,
        from: tx.from,
        to: tx.to,
        tokenID: tx.tokenID,
        timeStamp: tx.timeStamp,
      }));
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };
  
import { Engine } from "@thirdweb-dev/engine";

export async function POST(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed, please use POST" });
  }

  const { address } = await req.json();

  if (!address) {
    return Response.json({ error: "Missing address" });
  }

  const {
    TW_ENGINE_URL,
    TW_ACCESS_TOKEN,
    TW_BACKEND_WALLET,
    SECRET_KEY,
    NFT_CONTRACT_ADDRESS,
  } = process.env;

  if (!TW_ENGINE_URL || !TW_ACCESS_TOKEN || !TW_BACKEND_WALLET || !SECRET_KEY) {
    return Response.json({ error: "Missing environment variables" });
  }

  try {
    const engine = new Engine({
      url: TW_ENGINE_URL,
      accessToken: TW_ACCESS_TOKEN,
    });

    const response = await engine.erc721.claimTo(
      "Sepolia",
      NFT_CONTRACT_ADDRESS,
      TW_BACKEND_WALLET,
      {
        receiver: address,
        quantity: "1",
      }
    );

    console.log("NFT minted: ", response);

    // Función para verificar el estado de la transacción
    const checkTransactionStatus = async (queueId) => {
      const statusResponse = await fetch(
        `${TW_ENGINE_URL}/transaction/status/${queueId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TW_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const statusData = await statusResponse.json();
      return statusData;
    };

    // Polling hasta que el estado sea 'mined'
    const waitForTransaction = async (queueId) => {
      let status;
      while (true) {
        const transactionStatus = await checkTransactionStatus(queueId);
        status = transactionStatus.status;

        console.log("Transaction status: ", status);

        if (status === "mined") {
          return transactionStatus;
        }

        // Esperar un momento antes de volver a comprobar
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    };

    // Esperar el estado de la transacción
    const finalStatus = await waitForTransaction(response.result.queue_id);

    return Response.json({ message: "NFT Claimed successfully", finalStatus });
  } catch (error) {
    console.error("Error processing file: ", error);
    return Response.json({
      error: error.message || "An error occurred during minting",
    });
  }
}

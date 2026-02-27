export const env = {
  solanaRpcUrl:
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  solanaNetwork:
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") ??
    "devnet",
} as const;

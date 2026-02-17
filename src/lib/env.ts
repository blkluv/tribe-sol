export const env = {
  tapestryApiKey: process.env.NEXT_PUBLIC_TAPESTRY_API_KEY ?? "",
  tapestryBaseUrl:
    process.env.NEXT_PUBLIC_TAPESTRY_BASE_URL ??
    "https://api.dev.usetapestry.dev/v1",
  solanaRpcUrl:
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  solanaNetwork:
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") ??
    "devnet",
} as const;

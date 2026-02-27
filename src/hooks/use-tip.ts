"use client";

import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Demo recipient address (a known Devnet address)
const DEMO_TIP_RECIPIENT = new PublicKey(
  "11111111111111111111111111111112"
);

export interface TipRecord {
  id: string;
  castId: string;
  amount: number;
  signature: string;
  timestamp: number;
  recipientName: string;
}

// In-memory tip history (persists for current session)
let tipHistory: TipRecord[] = [];

export function useTip() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isSending, setIsSending] = useState(false);
  const [lastSignature, setLastSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendTip = useCallback(
    async (
      castId: string,
      amountSOL: number,
      recipientName: string
    ): Promise<{ success: boolean; signature?: string }> => {
      if (!publicKey || !sendTransaction) {
        setError("Wallet not connected");
        return { success: false };
      }

      setIsSending(true);
      setError(null);

      try {
        const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: DEMO_TIP_RECIPIENT,
            lamports,
          })
        );

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        const signature = await sendTransaction(transaction, connection);

        // Wait for confirmation
        await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "confirmed"
        );

        setLastSignature(signature);

        // Record tip in session history
        const record: TipRecord = {
          id: `tip-${Date.now()}`,
          castId,
          amount: amountSOL,
          signature,
          timestamp: Date.now(),
          recipientName,
        };
        tipHistory = [record, ...tipHistory];

        setIsSending(false);
        return { success: true, signature };
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Transaction failed";
        setError(msg);
        setIsSending(false);
        return { success: false };
      }
    },
    [publicKey, sendTransaction, connection]
  );

  return {
    sendTip,
    isSending,
    lastSignature,
    error,
    isWalletReady: !!publicKey,
    getTipHistory: () => tipHistory,
  };
}

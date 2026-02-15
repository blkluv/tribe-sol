"use client";

import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, TrendingUp } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { formatCurrency } from "@/lib/utils";

const mockTransactions = [
  { id: "t1", type: "received", description: "Tip for helpful cycling route post", amount: 50, from: "John Doe", time: "Just now" },
  { id: "t2", type: "received", description: "Thanks for Mumbai food recommendations!", amount: 75, from: "Priya Mehta", time: "1h ago" },
  { id: "t3", type: "sent", description: "Great yoga session tips!", amount: 25, to: "Lisa Brown", time: "2h ago" },
  { id: "t4", type: "received", description: "Amazing community event organization", amount: 100, from: "Neha Sharma", time: "1d ago" },
  { id: "t5", type: "sent", description: "Thanks for hackathon info", amount: 50, to: "Emily Chen", time: "1d ago" },
  { id: "t6", type: "deposit", description: "Added funds via UPI", amount: 500, time: "2d ago" },
  { id: "t7", type: "received", description: "Great Thames Path cleanup event", amount: 150, from: "James Wilson", time: "2d ago" },
];

export default function WalletPage() {
  const { currentUser } = useTribeStore();
  const wallet = currentUser?.wallet;

  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-6 text-white shadow-tribe-large">
          <p className="mb-1 text-sm text-white/70">Total Balance</p>
          <p className="mb-4 text-3xl font-bold">
            {wallet ? formatCurrency(wallet.balance, wallet.currencySymbol) : "₹0.00"}
          </p>
          <div className="flex gap-3">
            <button className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Plus className="h-4 w-4" />
              Add Funds
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <ArrowUpRight className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2 text-green-600">
            <ArrowDownLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Received</span>
          </div>
          <p className="mt-1 text-lg font-bold">₹1,250</p>
        </div>
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2 text-orange-500">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-sm font-medium">Sent</span>
          </div>
          <p className="mt-1 text-lg font-bold">₹450</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4">
        <h2 className="mb-3 text-base font-semibold">Recent Transactions</h2>
        <div className="space-y-1">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/50">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  tx.type === "received"
                    ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                    : tx.type === "sent"
                    ? "bg-orange-100 text-orange-500 dark:bg-orange-500/10"
                    : "bg-blue-100 text-blue-500 dark:bg-blue-500/10"
                }`}
              >
                {tx.type === "received" ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : tx.type === "sent" ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.type === "received" ? `From ${tx.from}` : tx.type === "sent" ? `To ${tx.to}` : "Wallet"}{" "}
                  &middot; {tx.time}
                </p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  tx.type === "received" || tx.type === "deposit"
                    ? "text-green-600"
                    : "text-foreground"
                }`}
              >
                {tx.type === "sent" ? "-" : "+"}₹{tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { BottomNav } from "./bottom-nav";
import { SidebarNav } from "./sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex flex-1 justify-center">
        <main className="w-full max-w-[1000px] flex">
          <div className="flex-1 w-full max-w-[630px] border-x min-h-screen pb-20 md:pb-0 bg-white shadow-sm">
            {children}
          </div>
          {/* Right Sidebar - Hidden on small screens */}
          <aside className="hidden lg:block w-[350px] p-8 space-y-8 sticky top-0 h-screen overflow-y-auto">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                <div className="h-3 w-32 rounded bg-muted animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">Suggested Tribes</span>
                <button className="text-xs font-bold hover:opacity-70">See All</button>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                    <div className="h-2 w-24 rounded bg-muted animate-pulse" />
                  </div>
                  <button className="text-xs font-bold text-blue-500">Follow</button>
                </div>
              ))}
            </div>
          </aside>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

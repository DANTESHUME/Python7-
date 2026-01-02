import { Link, useLocation } from "wouter";
import { useProgressStore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { levelFromXp, levelProgressPercent, nextLevelXp } from "@/lib/gamification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Terminal, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import planData from "../../../data/plan.json";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { days, lastActiveDay, xp, streak, badges } = useProgressStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Calculate total progress
  const totalDays = 7;
  const completedDays = Object.values(days).filter((d) => d.completed).length;
  const progressPercentage = (completedDays / totalDays) * 100;

  const SidebarContent = () => (
    <div className="flex flex-col h-full border-r-2 border-black bg-white">
      <div className="p-6 border-b-2 border-black">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-black text-white p-1 group-hover:bg-primary transition-colors">
              <Terminal size={24} />
            </div>
            <h1 className="font-mono font-bold text-xl tracking-tighter uppercase">
              7 天 Python
            </h1>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {planData.days.map((day) => {
            const isCompleted = days[day.day]?.completed;
            const isActive = location === `/day/${day.day}`;
            const isLocked = day.day > lastActiveDay;

            return (
              {isLocked ? (
              <div
                key={day.day}
                role="button"
                aria-disabled="true"
                tabIndex={0}
                className={cn(
                  "flex items-center gap-3 p-3 border-2 transition-all font-mono text-sm mb-2",
                  isActive
                    ? "bg-black text-white border-black translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                    : "bg-white border-black hover:bg-gray-100",
                  "opacity-50 cursor-not-allowed bg-gray-100"
                )}
                onClick={() => {
                  toast("🔒 还没解锁：请先完成前一天");
                  if (isMobileOpen) setIsMobileOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toast("🔒 还没解锁：请先完成前一天");
                    if (isMobileOpen) setIsMobileOpen(false);
                  }
                }}
              >
                <div className="font-bold text-lg w-6">{day.day}</div>
                <div className="flex-1 truncate">{day.title}</div>
                {isCompleted ? (
                  <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                  <Circle size={16} className="text-gray-300" />
                )}
              </div>
            ) : (
              <Link key={day.day} href={`/day/${day.day}`}>
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 border-2 transition-all cursor-pointer font-mono text-sm mb-2",
                    isActive
                      ? "bg-black text-white border-black translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                      : "bg-white border-black hover:bg-gray-100"
                  )}
                  onClick={() => isMobileOpen && setIsMobileOpen(false)}
                >
                  <div className="font-bold text-lg w-6">{day.day}</div>
                  <div className="flex-1 truncate">{day.title}</div>
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} className="text-gray-300" />
                  )}
                </div>
              </Link>
            )}
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t-2 border-black bg-gray-50 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
            <span>成长面板</span>
            <span>Lv {levelFromXp(xp)}</span>
          </div>
          <Progress value={levelProgressPercent(xp)} className="h-3 border-2 border-black rounded-none" />
          <div className="flex items-center justify-between text-xs font-mono">
            <span>XP {xp}</span>
            <span>下一等级 {nextLevelXp(xp)} XP</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="border-2 border-black bg-white p-2">
            <div className="font-bold uppercase">连胜</div>
            <div className="text-lg font-black">{streak}🔥</div>
          </div>
          <div className="border-2 border-black bg-white p-2">
            <div className="font-bold uppercase">徽章</div>
            <div className="text-lg font-black">{badges.length}</div>
          </div>
          <div className="border-2 border-black bg-white p-2">
            <div className="font-bold uppercase">进度</div>
            <div className="text-lg font-black">{Math.round(progressPercentage)}%</div>
          </div>
        </div>

        <Link href="/progress">
          <Button className="w-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-mono uppercase">
            查看进度与复盘
          </Button>
        </Link>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-white font-mono text-black selection:bg-green-200">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <Terminal size={20} />
          <span className="font-bold">7 天 Python</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="border border-black px-2 py-1 bg-yellow-50">Lv {levelFromXp(xp)}</span>
          <span className="border border-black px-2 py-1 bg-white">XP {xp}</span>
          <span className="border border-black px-2 py-1 bg-white">🔥 {streak}</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-r-2 border-black">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 h-full shrink-0">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f0f0f0] p-4 lg:p-8">
          <div className="max-w-4xl mx-auto bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

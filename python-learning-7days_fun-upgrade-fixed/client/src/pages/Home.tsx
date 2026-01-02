import { Link } from "wouter";
import { useProgressStore } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Terminal, Play, RotateCcw, CheckCircle2, Lock } from "lucide-react";
import planData from "../../../data/plan.json";
import { cn } from "@/lib/utils";
import { levelFromXp, levelProgressPercent, nextLevelXp } from "@/lib/gamification";
import { toast } from "sonner";

export default function Home() {
  const { days, lastActiveDay, resetProgress, xp, streak, badges } = useProgressStore();

  const totalDays = 7;
  const completedDays = Object.values(days).filter((d) => d.completed).length;
  const progressPercentage = (completedDays / totalDays) * 100;

  const handleReset = () => {
    if (confirm("确定要重置所有学习进度吗？此操作不可撤销。")) {
      resetProgress();
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header Section */}
      <div className="space-y-5 border-b-2 border-black pb-8">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2">
            <Terminal size={32} />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tighter">
              7 天 Python <span className="font-mono text-base align-middle">（为 AI 协作服务）</span>
            </h1>
            <p className="font-mono text-sm uppercase tracking-wide text-gray-600">
              目标：用最小代码，把 AI 变成你的生产力外挂
            </p>
          </div>
        </div>

        {/* Fun HUD */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 border-black bg-yellow-50">
            <CardHeader className="border-b-2 border-black py-3">
              <CardTitle className="font-mono font-bold uppercase text-sm">等级 & XP</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black">Lv {levelFromXp(xp)}</span>
                <span className="font-mono text-sm">XP {xp}</span>
              </div>
              <Progress value={levelProgressPercent(xp)} className="h-3 border-2 border-black rounded-none" />
              <div className="font-mono text-xs text-gray-600">下一等级：{nextLevelXp(xp)} XP</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black bg-white">
            <CardHeader className="border-b-2 border-black py-3">
              <CardTitle className="font-mono font-bold uppercase text-sm">连胜 & 徽章</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-3">
              <div className="border-2 border-black p-3 bg-orange-50">
                <div className="font-mono text-xs font-bold uppercase">连胜</div>
                <div className="text-3xl font-black">{streak}<span className="text-xl">🔥</span></div>
              </div>
              <div className="border-2 border-black p-3 bg-blue-50">
                <div className="font-mono text-xs font-bold uppercase">徽章</div>
                <div className="text-3xl font-black">{badges.length}</div>
              </div>
              <div className="col-span-2 font-mono text-xs text-gray-600">
                小技巧：按顺序完成才会累计连胜（断了也没关系，继续就好）
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black bg-green-50">
            <CardHeader className="border-b-2 border-black py-3">
              <CardTitle className="font-mono font-bold uppercase text-sm">7 天通关进度</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between font-mono text-xs font-bold uppercase">
                <span>{completedDays}/7 天已完成</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-4 w-full border-2 border-black bg-white p-0.5">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-700">
                今天只要走一步：完成两道练习题，就算赢。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/day/${lastActiveDay}`}>
            <Button className="font-mono font-bold uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
              <Play className="mr-2 h-4 w-4" />
              继续学习（Day {lastActiveDay}）
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleReset}
            className="font-mono font-bold uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            重置进度
          </Button>
        </div>
      </div>

{/* Day Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planData.days.map((day) => {
          const isCompleted = days[day.day]?.completed;
          const isLocked = day.day > lastActiveDay && !isCompleted;
          const isCurrent = day.day === lastActiveDay && !isCompleted;

          return isLocked ? (
            <div
              key={day.day}
              role="button"
              tabIndex={0}
              onClick={() => toast("🔒 还没解锁：请先完成前一天")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toast("🔒 还没解锁：请先完成前一天");
              }}
              className="outline-none"
            >
              <Card
                className={cn(
                  "h-full border-2 border-black transition-all duration-200 bg-gray-100 opacity-75 cursor-not-allowed",
                  isCurrent && "ring-2 ring-black ring-offset-2"
                )}
              >
                <CardHeader className="border-b-2 border-black pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-mono text-xl font-bold uppercase">
                      Day {day.day}
                    </CardTitle>
                    <Lock className="text-gray-400 h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <h3 className="font-bold text-lg leading-tight min-h-[3rem]">
                    {day.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 font-mono">
                    {day.goal}
                  </p>

                  <div className="pt-2">
                    <span className="inline-block px-2 py-1 text-xs font-bold border border-black bg-gray-200 text-gray-700">
                      未解锁
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Link key={day.day} href={`/day/${day.day}`}>
              <Card
                className={cn(
                  "h-full border-2 border-black transition-all duration-200 bg-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer",
                  isCurrent && "ring-2 ring-black ring-offset-2"
                )}
              >
                <CardHeader className="border-b-2 border-black pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-mono text-xl font-bold uppercase">
                      Day {day.day}
                    </CardTitle>
                    {isCompleted ? (
                      <CheckCircle2 className="text-green-600 h-6 w-6" />
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <h3 className="font-bold text-lg leading-tight min-h-[3rem]">
                    {day.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 font-mono">
                    {day.goal}
                  </p>

                  <div className="pt-2">
                    <span
                      className={cn(
                        "inline-block px-2 py-1 text-xs font-bold border border-black",
                        isCompleted
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {isCompleted ? "已完成" : "进行中"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

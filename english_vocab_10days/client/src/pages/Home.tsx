import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/utils/progress';
import planData from '@/data/plan.json';
import { Trophy, Calendar, BookOpen, RotateCcw, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Home() {
  const { progress, resetProgress } = useProgress();
  
  const totalDays = 10;
  const completedDays = Object.values(progress.days).filter(d => d.completed).length;
  const totalProgress = (completedDays / totalDays) * 100;
  
  const masteredWords = Object.values(progress.words).filter(w => w.status === 'mastered').length;
  const totalWords = 500; // 10 days * 50 words

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              10
            </div>
            <h1 className="text-xl font-bold text-slate-800">英语高频词</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={resetProgress} className="text-slate-400 hover:text-destructive">
            <RotateCcw className="w-4 h-4 mr-1" /> 重置
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Progress Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">总进度</p>
                <h2 className="text-3xl font-bold">{Math.round(totalProgress)}%</h2>
              </div>
              <div className="mt-4">
                <Progress value={totalProgress} className="h-2 bg-blue-400/30 [&>div]:bg-white" />
                <p className="text-xs text-blue-100 mt-2 flex justify-between">
                  <span>已完成 {completedDays} 天</span>
                  <span>目标 10 天</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">已掌握单词</p>
                <h3 className="text-2xl font-bold text-slate-800">{masteredWords} <span className="text-sm text-slate-400 font-normal">/ {totalWords}</span></h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">当前学习</p>
                <h3 className="text-2xl font-bold text-slate-800">Day {progress.currentDay}</h3>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Action Buttons */}
        <section className="flex gap-4">
          <Link href={`/day/${progress.currentDay}`} className="flex-1">
            <Button size="lg" className="w-full h-14 text-lg shadow-blue-200 shadow-lg hover:shadow-xl transition-all">
              <BookOpen className="w-5 h-5 mr-2" /> 继续学习 Day {progress.currentDay}
            </Button>
          </Link>
          <Link href="/review">
            <Button size="lg" variant="outline" className="h-14 px-8 border-2 hover:bg-slate-50">
              复习
            </Button>
          </Link>
        </section>

        {/* Day Cards Grid */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4">课程表</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {planData.days.map((day) => {
              const isLocked = day.day > progress.currentDay && !progress.days[day.day - 1]?.completed;
              const isCompleted = progress.days[day.day]?.completed;
              const isCurrent = day.day === progress.currentDay;

              return (
                <Link key={day.day} href={isLocked ? '#' : `/day/${day.day}`}>
                  <Card className={cn(
                    "h-full transition-all duration-300 hover:shadow-md border-none cursor-pointer relative overflow-hidden group",
                    isLocked ? "opacity-50 bg-slate-100 cursor-not-allowed" : "bg-white",
                    isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                  )}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant={isCompleted ? "default" : "secondary"} className={cn(
                          isCompleted ? "bg-green-500 hover:bg-green-600" : ""
                        )}>
                          Day {day.day}
                        </Badge>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <CardTitle className="text-base mt-2 line-clamp-1">{day.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{day.goals[0]}</p>
                      {!isLocked && (
                        <div className="flex items-center text-primary text-xs font-medium group-hover:translate-x-1 transition-transform">
                          开始学习 <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      )}
                    </CardContent>
                    {isLocked && (
                      <div className="absolute inset-0 bg-slate-200/10 backdrop-blur-[1px] flex items-center justify-center">
                        {/* Lock icon could go here */}
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

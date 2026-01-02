import { useProgressStore } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, CheckCircle2, XCircle, AlertTriangle, Terminal } from "lucide-react";
import planData from "../../../data/plan.json";
import { cn } from "@/lib/utils";
import { BADGES, levelFromXp } from "@/lib/gamification";

export default function ProgressPage() {
  const { days, mistakes, notes, xp, streak, badges } = useProgressStore();

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      progress: days,
      mistakes,
      notes
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "python-learning-progress.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="border-b-2 border-black pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Learning Report</h1>
          <p className="text-gray-600 font-mono">Track your journey and review mistakes</p>
        </div>
        <Button 
          onClick={handleExport}
          className="font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
        >
          <Download className="mr-2 h-4 w-4" />
          EXPORT JSON
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Progress List */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black bg-gray-50">
            <CardTitle className="font-mono font-bold uppercase flex items-center gap-2">
              <Terminal size={20} />
              Daily Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="divide-y-2 divide-gray-100">
                {planData.days.map((day) => {
                  const dayProgress = days[day.day];
                  const isCompleted = dayProgress?.completed;
                  const exerciseCount = day.exercises.length;
                  const completedExercises = Object.values(dayProgress?.exercises || {}).filter(e => e.completed).length;

                  return (
                    <div key={day.day} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="font-bold font-mono mb-1">DAY {day.day}: {day.title}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          Exercises: {completedExercises}/{exerciseCount} • Homework: {dayProgress?.homework ? 'Submitted' : 'Pending'}
                        </div>
                      </div>
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold font-mono text-sm bg-green-50 px-2 py-1 rounded-full border border-green-200">
                          <CheckCircle2 size={16} /> DONE
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400 font-bold font-mono text-sm bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
                          <div className="w-2 h-2 rounded-full bg-gray-400" /> PENDING
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Mistakes Log */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black bg-red-50">
            <CardTitle className="font-mono font-bold uppercase flex items-center gap-2 text-red-900">
              <AlertTriangle size={20} />
              Error Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {Object.keys(mistakes).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-gray-400 text-center">
                  <CheckCircle2 size={48} className="mb-4 opacity-20" />
                  <p className="font-mono">No mistakes recorded yet.</p>
                  <p className="text-sm mt-2">Keep up the good work!</p>
                </div>
              ) : (
                <div className="divide-y-2 divide-gray-100">
                  {Object.entries(mistakes).map(([id, wrongAnswer]) => {
                    // Find the question text
                    let questionText = "Unknown Question";
                    let dayTitle = "";
                    
                    planData.days.forEach(d => {
                      const ex = d.exercises.find(e => e.id === id);
                      if (ex) {
                        questionText = ex.question;
                        dayTitle = `Day ${d.day}`;
                      }
                    });

                    return (
                      <div key={id} className="p-4 hover:bg-red-50/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded-sm font-mono">
                            {dayTitle}
                          </span>
                          <span className="text-xs font-mono text-gray-400">ID: {id}</span>
                        </div>
                        <p className="text-sm font-medium mb-2 line-clamp-2">{questionText}</p>
                        <div className="bg-red-50 border border-red-100 p-2 rounded text-xs font-mono text-red-800">
                          <span className="font-bold">Your Answer:</span> {wrongAnswer}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="border-b-2 border-black bg-yellow-50">
          <CardTitle className="font-mono font-bold uppercase">每日复盘与笔记</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {planData.days.map((day) => {
              const dayProgress = days[day.day];
              const hasContent = dayProgress?.review?.some(r => r) || dayProgress?.homework;
              
              if (!hasContent) return null;

              return (
                <div key={day.day} className="border-2 border-black p-4 bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <h4 className="font-bold font-mono border-b-2 border-black pb-2 mb-3">Day {day.day}</h4>
                  
                  {dayProgress.homework && (
                    <div className="mb-4">
                      <div className="text-xs font-bold uppercase text-gray-500 mb-1">Homework</div>
                      <p className="text-sm font-mono bg-gray-50 p-2 border border-gray-200 line-clamp-3">
                        {dayProgress.homework}
                      </p>
                    </div>
                  )}

                  {dayProgress.review && dayProgress.review.length > 0 && (
                    <div>
                      <div className="text-xs font-bold uppercase text-gray-500 mb-1">Review Answers</div>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {dayProgress.review.map((ans, idx) => (
                          ans && <li key={idx} className="truncate text-gray-700">{ans}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
            
            {Object.values(days).every(d => !d.review?.some(r => r) && !d.homework) && (
              <div className="col-span-full text-center py-8 text-gray-500 font-mono">
                No notes or reviews recorded yet. Complete daily tasks to see them here.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

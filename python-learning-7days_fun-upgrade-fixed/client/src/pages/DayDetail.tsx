import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useProgressStore } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, ChevronRight, AlertTriangle, Copy, Check, Play, Terminal } from "lucide-react";
import { toast } from "sonner";
import planData from "../../../data/plan.json";
import { cn } from "@/lib/utils";
import ConfettiBurst from "@/components/ConfettiBurst";
import { badgeById } from "@/lib/gamification";

// Exercise Component
const Exercise = ({ dayId, exercise }: { dayId: number; exercise: any }) => {
  const { days, updateExercise, recordMistake } = useProgressStore();
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const state = days[dayId]?.exercises?.[exercise.id] || { completed: false, attempts: 0 };

  const checkAnswer = () => {
    const correct = userAnswer.trim() === exercise.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      updateExercise(dayId, exercise.id, true);
      toast.success("✅ 正确！+10 XP");
    } else {
      updateExercise(dayId, exercise.id, false);
      recordMistake(exercise.id, userAnswer);
      toast.error("❌ 不对，再来一次（提示在下面）");
      if (!showHint) setShowHint(true);
    }
  };

  return (
    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
      <CardHeader className="bg-gray-50 border-b-2 border-black py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-mono font-bold uppercase flex items-center gap-2">
            <Play size={16} /> 练习: {exercise.type === 'choice' ? '选择题' : exercise.type === 'predict' ? '预测输出' : '填空题'}
          </CardTitle>
          {state.completed && <CheckCircle2 className="text-green-600" size={20} />}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="font-mono bg-black text-white p-4 rounded-sm whitespace-pre-wrap text-sm">
          {exercise.question}
        </div>

        {exercise.type === 'choice' ? (
          <div className="space-y-2">
            {exercise.options.map((opt: string, idx: number) => (
              <div 
                key={idx}
                onClick={() => !state.completed && setUserAnswer(opt)}
                className={cn(
                  "p-3 border-2 cursor-pointer font-mono text-sm transition-all",
                  userAnswer === opt 
                    ? "bg-black text-white border-black" 
                    : "bg-white border-gray-200 hover:border-black",
                  state.completed && opt === exercise.answer && "bg-green-100 border-green-500 text-green-900",
                  state.completed && userAnswer === opt && opt !== exercise.answer && "bg-red-100 border-red-500 text-red-900"
                )}
              >
                {opt}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={state.completed}
              placeholder="在此输入你的答案..."
              className="w-full p-3 font-mono border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>
        )}

        {showHint && !isCorrect && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800 flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>提示: {exercise.hint}</span>
          </div>
        )}

        {!state.completed && (
          <Button 
            onClick={checkAnswer}
            className="w-full font-mono font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none active:translate-y-1 transition-all"
          >
            提交答案
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function DayDetail() {
  const [match, params] = useRoute("/day/:id");
  const [, setLocation] = useLocation();
  const { days, completeDay, save今日作业, saveReview } = useProgressStore();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!match || !params) return null;
  
  const dayId = parseInt(params.id);
  const dayData = planData.days.find(d => d.day === dayId);
  
  if (!dayData) return <div>Day not found</div>;

  const progress = days[dayId] || { completed: false, exercises: {}, homework: '', review: [] };
  
  // Check if all exercises are completed
  const allExercisesCompleted = dayData.exercises.every(
    ex => progress.exercises[ex.id]?.completed
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(dayData.exampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("📋 已复制！可以粘到编辑器里跑一跑");
  };

  const handleComplete = () => {
    if (!allExercisesCompleted) {
      toast.error("还差一步：先通关本页所有练习题");
      return;
    }
    if (!progress.homework) {
      toast.error("作业还没写：哪怕写两句也算完成");
      return;
    }
    
    completeDay(dayId);
    const badge = badgeById(`day${dayId}`);
    toast.success(`🎉 通关成功！+50 XP${badge ? `，获得徽章：${badge.emoji} ${badge.name}` : ""}`);
    setShowConfetti(true);
    
    if (dayId < 7) {
      setTimeout(() => setLocation(`/day/${dayId + 1}`), 1500);
    } else {
      setTimeout(() => setLocation('/progress'), 1500);
    }
  };

  return (
    <div className="space-y-8">
      <ConfettiBurst show={showConfetti} onDone={() => setShowConfetti(false)} />
      {/* Header */}
      <div className="border-b-2 border-black pb-6">
        <div className="flex items-center gap-2 text-sm font-mono font-bold text-gray-500 mb-2">
          <span>DAY {dayData.day}</span>
          <ChevronRight size={14} />
          <span className="text-black uppercase">Learning Phase</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">{dayData.title}</h1>
        <div className="bg-yellow-50 border-l-4 border-black p-4">
          <h3 className="font-bold font-mono text-sm uppercase mb-1">Today's Goal</h3>
          <p className="text-gray-800">{dayData.goal}</p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {dayData.sections.map((section, idx) => (
          <div key={idx} className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mb-3">
              {section.title}
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Example Code */}
      <Card className="bg-gray-900 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
        <CardHeader className="border-b border-gray-700 py-3 flex flex-row items-center justify-between">
          <CardTitle className="font-mono text-sm text-gray-300">example.py</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyCode}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] w-full">
            <pre className="p-4 font-mono text-sm leading-relaxed">
              <code>{dayData.exampleCode}</code>
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 闯关练习 */}
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
          <Terminal className="bg-black text-white p-1 rounded-sm" size={32} />
          闯关练习
        </h2>
        {dayData.exercises.map((ex) => (
          <Exercise key={ex.id} dayId={dayId} exercise={ex} />
        ))}
      </div>

      {/* 今日作业 */}
      <Card className="border-2 border-black bg-blue-50">
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="font-mono font-bold uppercase flex items-center gap-2">
            <span>📝 今日作业: {dayData.homework.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-gray-800">{dayData.homework.description}</p>
          <div className="bg-white border-2 border-black p-4 font-mono text-sm text-gray-600 mb-4">
            {dayData.homework.template}
          </div>
          <Textarea 
            placeholder="在此粘贴你的代码或运行结果..."
            className="min-h-[150px] font-mono border-2 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            value={progress.homework}
            onChange={(e) => save今日作业(dayId, e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Review & 常见错误排查 Tabs */}
      <Tabs defaultValue="review" className="w-full">
        <TabsList className="w-full border-2 border-black p-0 h-auto bg-transparent gap-0">
          <TabsTrigger 
            value="review" 
            className="flex-1 border-r-2 border-black rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-mono font-bold py-3"
          >
            DAILY REVIEW
          </TabsTrigger>
          <TabsTrigger 
            value="troubleshoot" 
            className="flex-1 rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-mono font-bold py-3"
          >
            TROUBLESHOOTING
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="review" className="border-2 border-t-0 border-black p-6 mt-0 bg-white">
          <div className="space-y-6">
            {dayData.review.map((question, idx) => (
              <div key={idx} className="space-y-2">
                <p className="font-bold text-sm uppercase">Q{idx + 1}: {question}</p>
                <Textarea 
                  placeholder="写下你的思考..."
                  className="font-mono text-sm border-gray-300 focus:border-black transition-all"
                  value={progress.review?.[idx] || ''}
                  onChange={(e) => saveReview(dayId, idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="troubleshoot" className="border-2 border-t-0 border-black p-6 mt-0 bg-white">
          <div className="space-y-4">
            {dayData.troubleshooting.map((item, idx) => (
              <div key={idx} className="bg-red-50 border border-red-100 p-4 rounded-sm">
                <code className="text-red-600 font-bold text-sm block mb-2">{item.error}</code>
                <p className="text-gray-700 text-sm">{item.solution}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Complete Button */}
      <div className="pt-8 pb-20">
        <Button 
          size="lg" 
          onClick={handleComplete}
          disabled={progress.completed}
          className={cn(
            "w-full h-16 text-xl font-mono font-bold border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all",
            progress.completed 
              ? "bg-green-500 text-white hover:bg-green-600 border-green-700" 
              : "bg-black text-white hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none"
          )}
        >
          {progress.completed ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 /> COMPLETED
            </span>
          ) : (
            "COMPLETE DAY & CONTINUE"
          )}
        </Button>
      </div>
    </div>
  );
}

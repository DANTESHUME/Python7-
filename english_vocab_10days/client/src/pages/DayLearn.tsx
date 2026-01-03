import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useProgress } from '@/utils/progress';
import { WordCard } from '@/components/WordCard';
import { PronounceButton } from '@/components/PronounceButton';
import { PracticeSession } from '@/components/PracticeSession';
import planData from '@/data/plan.json';
import { ArrowLeft, CheckCircle, BookOpen, PenTool, RotateCw, Trophy, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayLearnProps {
  day: string;
}

export default function DayLearn({ day }: DayLearnProps) {
  const [, setLocation] = useLocation();
  const { progress, markWord, completeDay } = useProgress();
  const [activeTab, setActiveTab] = useState('learn');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [autoShowMeaning, setAutoShowMeaning] = useState(false);
  const [reviewAnswer, setReviewAnswer] = useState('');
  const [showReviewResult, setShowReviewResult] = useState(false);
  
  const dayNum = parseInt(day || '1');
  const dayData = planData.days.find(d => d.day === dayNum);

  if (!dayData) {
    return <div className="p-8 text-center">Day not found</div>;
  }

  const words = dayData.words || [];
  const currentWord = words[currentWordIndex];
  const progressPercent = ((currentWordIndex + 1) / words.length) * 100;

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setActiveTab('practice');
    }
  };

  const handleCompleteDay = () => {
    completeDay(dayNum, 100);
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 返回首页
          </Button>
          <h1 className="font-bold text-slate-800">Day {dayNum}: {dayData.title}</h1>
          <div className="w-24">
            <Progress value={activeTab === 'learn' ? progressPercent : 100} className="h-2" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="goals">目标</TabsTrigger>
            <TabsTrigger value="learn">学习</TabsTrigger>
            <TabsTrigger value="practice">练习</TabsTrigger>
            <TabsTrigger value="review">复盘</TabsTrigger>
          </TabsList>

          {/* 1. Goals & Methods */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" /> 今日目标
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dayData.goals.map((goal, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500" /> {goal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" /> 学习方法
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dayData.methods.map((method, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-bold text-slate-800 mb-1">{method.title}</h4>
                    <p className="text-sm text-slate-600">{method.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={() => setActiveTab('learn')}>
              开始学习单词
            </Button>
          </TabsContent>

          {/* 2. Word Learning */}
          <TabsContent value="learn" className="space-y-6">
            {words.length > 0 ? (
              <>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>单词 {currentWordIndex + 1} / {words.length}</span>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-meaning" 
                      checked={autoShowMeaning}
                      onCheckedChange={setAutoShowMeaning}
                    />
                    <Label htmlFor="auto-meaning">自动显示释义</Label>
                  </div>
                </div>

                <WordCard 
                  word={currentWord} 
                  onStatusChange={(status) => markWord(currentWord.id, status)}
                  className="min-h-[400px]"
                  defaultShowMeaning={autoShowMeaning}
                />

                {currentWord.hint && (
                  <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-yellow-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>记忆提示：{currentWord.hint}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    disabled={currentWordIndex === 0}
                    onClick={() => setCurrentWordIndex(prev => prev - 1)}
                  >
                    上一个
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleNextWord}
                  >
                    {currentWordIndex === words.length - 1 ? '完成学习，去练习' : '下一个'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                本单元暂无单词数据
              </div>
            )}
          </TabsContent>

          {/* 3. Practice & Homework */}
          <TabsContent value="practice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-purple-500" /> 今日小作业
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 font-medium">{dayData.homework.description}</p>
                <Textarea placeholder={dayData.homework.placeholder} className="min-h-[100px]" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCw className="w-5 h-5 text-orange-500" /> 互动练习
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PracticeSession 
                  words={words} 
                  onComplete={() => setActiveTab('review')} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Review & Summary */}
          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>今日复盘</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dayData.review_questions.map((q, i) => (
                  <div key={i} className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">{q}</label>
                    <Textarea placeholder="写下你的想法..." className="h-20" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">常见错误与排查</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dayData.common_errors.map((err, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-xs font-bold">
                      !
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{err.title}</h4>
                      <p className="text-sm text-slate-600">{err.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" onClick={handleCompleteDay}>
              <CheckCircle className="w-5 h-5 mr-2" /> 完成今日学习
            </Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

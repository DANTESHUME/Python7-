import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/utils/progress';
import { PronounceButton } from '@/components/PronounceButton';
import planData from '@/data/plan.json';
import { ArrowLeft, Check, X, HelpCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Review() {
  const { progress, markWord } = useProgress();
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  // Build review queue based on spaced repetition logic
  useEffect(() => {
    const now = Date.now();
    const dueWords = Object.values(progress.words)
      .filter(w => w.nextReview <= now && w.status !== 'new')
      .sort((a, b) => a.nextReview - b.nextReview)
      .map(w => w.id);
    
    setQueue(dueWords);
  }, []);

  const currentWordId = queue[currentIndex];
  // Find word data from plan.json
  const wordData = planData.days
    .flatMap(d => d.words)
    .find(w => w.id === currentWordId);

  const handleResult = (result: 'known' | 'unknown') => {
    if (!currentWordId) return;

    // Update stats
    setStats(prev => ({
      ...prev,
      [result === 'known' ? 'correct' : 'wrong']: prev[result === 'known' ? 'correct' : 'wrong'] + 1
    }));

    // Update word progress
    markWord(currentWordId, result === 'known' ? 'mastered' : 'learning');

    // Move to next
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  if (queue.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">太棒了！</h2>
          <p className="text-slate-600 mb-8">目前没有需要复习的单词。</p>
          <Link href="/">
            <Button className="w-full">返回首页</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">复习完成</h2>
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">认识</p>
              <p className="text-2xl font-bold text-green-700">{stats.correct}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600">模糊/不认识</p>
              <p className="text-2xl font-bold text-orange-700">{stats.wrong}</p>
            </div>
          </div>
          <Link href="/">
            <Button className="w-full">返回首页</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!wordData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 p-4">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> 退出</Button>
          </Link>
          <span className="font-mono text-sm text-slate-500">
            {currentIndex + 1} / {queue.length}
          </span>
        </div>
        <Progress value={((currentIndex) / queue.length) * 100} className="h-1 mt-4" />
      </header>

      <main className="flex-1 container mx-auto max-w-2xl p-4 flex flex-col justify-center">
        <Card className="min-h-[400px] flex flex-col justify-center items-center text-center p-8 relative overflow-hidden">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-slate-800">{wordData.word}</h2>
            
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{wordData.ipa}</span>
              <PronounceButton text={wordData.word} />
            </div>

            {showAnswer ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="h-px w-16 bg-slate-200 mx-auto" />
                <div>
                  <p className="text-xl font-bold text-primary mb-1">{wordData.meaning_cn}</p>
                  <p className="text-sm text-slate-400">{wordData.pos}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-left">
                  <p className="text-slate-700 italic mb-1">"{wordData.example_en}"</p>
                  <p className="text-xs text-slate-500">{wordData.example_cn}</p>
                </div>
              </div>
            ) : (
              <div className="pt-12">
                <Button variant="ghost" className="text-slate-400" onClick={() => setShowAnswer(true)}>
                  <HelpCircle className="w-4 h-4 mr-2" /> 点击查看答案
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {!showAnswer ? (
            <Button size="lg" className="col-span-2 h-14 text-lg" onClick={() => setShowAnswer(true)}>
              显示答案
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 text-lg border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                onClick={() => handleResult('unknown')}
              >
                <X className="w-5 h-5 mr-2" /> 不认识 / 模糊
              </Button>
              <Button 
                size="lg" 
                className="h-14 text-lg bg-green-600 hover:bg-green-700"
                onClick={() => handleResult('known')}
              >
                <Check className="w-5 h-5 mr-2" /> 认识
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

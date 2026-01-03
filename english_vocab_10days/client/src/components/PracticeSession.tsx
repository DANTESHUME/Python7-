import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PronounceButton } from './PronounceButton';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Word {
  id: string;
  word: string;
  ipa: string;
  meaning_cn: string;
  example_en: string;
}

interface PracticeSessionProps {
  words: Word[];
  onComplete: () => void;
}

type QuestionType = 'choice' | 'spell';

interface Question {
  word: Word;
  type: QuestionType;
  options?: string[]; // For choice questions
}

export function PracticeSession({ words, onComplete }: PracticeSessionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [spellInput, setSpellInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Generate questions on mount
  useEffect(() => {
    const newQuestions: Question[] = [];
    // Shuffle words for practice
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 10); // Pick 10 random words for daily practice

    shuffled.forEach(word => {
      // 50% chance for choice, 50% for spell
      const type = Math.random() > 0.5 ? 'choice' : 'spell';
      
      if (type === 'choice') {
        // Generate distractors
        const distractors = words
          .filter(w => w.id !== word.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(w => w.meaning_cn);
        
        const options = [...distractors, word.meaning_cn].sort(() => Math.random() - 0.5);
        newQuestions.push({ word, type, options });
      } else {
        newQuestions.push({ word, type });
      }
    });

    setQuestions(newQuestions);
  }, [words]);

  const handleChoice = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    const correct = option === questions[currentIndex].word.meaning_cn;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleSpellCheck = () => {
    if (isAnswered) return;
    const correct = spellInput.trim().toLowerCase() === questions[currentIndex].word.word.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setSpellInput('');
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      onComplete();
    }
  };

  if (questions.length === 0) return <div>Loading practice...</div>;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-sm text-slate-500">
        <span>练习 {currentIndex + 1} / {questions.length}</span>
        <Progress value={progress} className="w-32 h-2" />
      </div>

      <Card className="min-h-[300px] flex flex-col justify-center">
        <CardContent className="p-6 space-y-6">
          {/* Question Header */}
          <div className="text-center space-y-2">
            <Badge variant="outline" className="mb-2">
              {currentQ.type === 'choice' ? '选择正确的释义' : '拼写单词'}
            </Badge>
            
            {currentQ.type === 'choice' ? (
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-3xl font-bold text-slate-800">{currentQ.word.word}</h3>
                <PronounceButton text={currentQ.word.word} />
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">{currentQ.word.meaning_cn}</h3>
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <span className="font-mono bg-slate-100 px-2 rounded">{currentQ.word.ipa}</span>
                  <PronounceButton text={currentQ.word.word} />
                </div>
              </div>
            )}
          </div>

          {/* Question Body */}
          <div className="max-w-md mx-auto w-full space-y-4">
            {currentQ.type === 'choice' ? (
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options?.map((option, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={cn(
                      "h-12 text-lg justify-start px-4",
                      isAnswered && option === currentQ.word.meaning_cn && "bg-green-100 border-green-500 text-green-700 hover:bg-green-100 hover:text-green-700",
                      isAnswered && selectedOption === option && option !== currentQ.word.meaning_cn && "bg-red-100 border-red-500 text-red-700 hover:bg-red-100 hover:text-red-700"
                    )}
                    onClick={() => handleChoice(option)}
                    disabled={isAnswered}
                  >
                    {option}
                    {isAnswered && option === currentQ.word.meaning_cn && <CheckCircle className="ml-auto w-5 h-5" />}
                    {isAnswered && selectedOption === option && option !== currentQ.word.meaning_cn && <XCircle className="ml-auto w-5 h-5" />}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={spellInput}
                    onChange={(e) => setSpellInput(e.target.value)}
                    placeholder="输入英文单词..."
                    className={cn(
                      "text-lg h-12 text-center font-bold",
                      isAnswered && isCorrect && "border-green-500 bg-green-50 text-green-700",
                      isAnswered && !isCorrect && "border-red-500 bg-red-50 text-red-700"
                    )}
                    disabled={isAnswered}
                    onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleSpellCheck()}
                  />
                </div>
                {!isAnswered && (
                  <div className="flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setShowHint(true)} disabled={showHint}>
                      <HelpCircle className="w-4 h-4 mr-1" /> 提示
                    </Button>
                    <Button onClick={handleSpellCheck}>提交</Button>
                  </div>
                )}
                {showHint && !isAnswered && (
                  <p className="text-sm text-orange-500 text-center animate-in fade-in">
                    首字母: <span className="font-bold">{currentQ.word.word[0]}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Feedback & Next */}
          {isAnswered && (
            <div className="animate-in fade-in slide-in-from-bottom-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className={cn("font-bold flex items-center gap-2", isCorrect ? "text-green-600" : "text-red-600")}>
                  {isCorrect ? (
                    <><CheckCircle className="w-5 h-5" /> 回答正确！</>
                  ) : (
                    <><XCircle className="w-5 h-5" /> 正确答案: {currentQ.word.word}</>
                  )}
                </div>
                <Button onClick={handleNext}>
                  {currentIndex === questions.length - 1 ? '完成练习' : '下一题'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variant === 'outline' ? "text-foreground" : "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      className
    )}>
      {children}
    </span>
  );
}

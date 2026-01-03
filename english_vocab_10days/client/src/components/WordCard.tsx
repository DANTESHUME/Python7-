import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PronounceButton } from './PronounceButton';
import { Check, X, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Word {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  meaning_cn: string;
  example_en: string;
  example_cn: string;
  hint?: string;
}

interface WordCardProps {
  word: Word;
  onStatusChange?: (status: 'mastered' | 'learning') => void;
  showActions?: boolean;
  className?: string;
  defaultShowMeaning?: boolean; // 新增属性：默认显示释义
}

export function WordCard({ word, onStatusChange, showActions = true, className, defaultShowMeaning = false }: WordCardProps) {
  const [showMeaning, setShowMeaning] = useState(defaultShowMeaning);
  const [status, setStatus] = useState<'new' | 'mastered' | 'learning'>('new');

  // 当单词切换时，重置显示状态（除非强制默认显示）
  useEffect(() => {
    setShowMeaning(defaultShowMeaning);
  }, [word.id, defaultShowMeaning]);

  const handleStatus = (newStatus: 'mastered' | 'learning') => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  return (
    <Card className={cn("w-full bg-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden", className)}>
      <div className="flex flex-col h-full">
        {/* Top Section: Word & Pronunciation */}
        <div className="p-8 flex flex-col items-center justify-center space-y-4 border-b border-slate-100 bg-slate-50/50 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-4xl font-bold text-slate-800 tracking-tight">{word.word}</h3>
            <PronounceButton text={word.word} />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-sm">{word.ipa}</span>
            <Badge variant="outline" className="uppercase tracking-wider text-xs font-semibold">{word.pos}</Badge>
          </div>
        </div>

        {/* Bottom Section: Meaning & Examples (Toggleable) */}
        <div className="relative bg-white flex-1 flex flex-col">
          {showMeaning ? (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-2">
                <h4 className="text-2xl font-bold text-primary">{word.meaning_cn}</h4>
                {word.hint && (
                  <p className="text-xs text-orange-500 bg-orange-50 inline-block px-2 py-1 rounded">
                    💡 {word.hint}
                  </p>
                )}
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-lg text-slate-700 font-medium mb-2 leading-relaxed">"{word.example_en}"</p>
                <p className="text-slate-500">{word.example_cn}</p>
              </div>

              {showActions && (
                <div className="flex justify-center gap-4 pt-2">
                  <Button 
                    size="lg" 
                    variant={status === 'learning' ? 'default' : 'outline'}
                    className={cn(
                      "w-32 transition-all", 
                      status === 'learning' ? "bg-orange-500 hover:bg-orange-600 border-transparent" : "hover:border-orange-200 hover:text-orange-600"
                    )}
                    onClick={() => handleStatus('learning')}
                  >
                    <X className="mr-2 h-4 w-4" /> 不熟
                  </Button>
                  <Button 
                    size="lg" 
                    variant={status === 'mastered' ? 'default' : 'outline'}
                    className={cn(
                      "w-32 transition-all", 
                      status === 'mastered' ? "bg-green-500 hover:bg-green-600 border-transparent" : "hover:border-green-200 hover:text-green-600"
                    )}
                    onClick={() => handleStatus('mastered')}
                  >
                    <Check className="mr-2 h-4 w-4" /> 掌握
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center h-full min-h-[200px]">
              <p className="text-slate-400 mb-6 text-sm">思考一下释义...</p>
              <Button 
                variant="outline" 
                size="lg"
                className="group hover:border-primary hover:text-primary transition-all"
                onClick={() => setShowMeaning(true)}
              >
                <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> 查看释义
              </Button>
            </div>
          )}
          
          {/* Toggle Button (Always visible if shown) */}
          {showMeaning && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 text-slate-300 hover:text-slate-500"
              onClick={() => setShowMeaning(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

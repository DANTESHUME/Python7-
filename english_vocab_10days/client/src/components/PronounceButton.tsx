import { useState } from 'react';
import { Volume2, Loader2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pronounce } from '@/utils/pronounce';
import { cn } from '@/lib/utils';

interface PronounceButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
}

export function PronounceButton({ text, className, size = 'icon', variant = 'ghost' }: PronounceButtonProps) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'error'>('idle');

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === 'playing') return;

    setStatus('playing');
    pronounce.speak(text, {
      onEnd: () => setStatus('idle'),
      onError: () => setStatus('error')
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("rounded-full transition-all duration-300", className, {
        "text-primary bg-primary/10": status === 'playing',
        "text-destructive": status === 'error'
      })}
      onClick={handlePlay}
      disabled={status === 'playing'}
      title="点击发音"
    >
      {status === 'playing' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : status === 'error' ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span className="sr-only">发音</span>
    </Button>
  );
}

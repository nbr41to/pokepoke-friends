'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface ClipboardCopyButtonProps {
  text: string;
  className?: string;
}

export function ClipboardCopyButton({
  text,
  className,
}: ClipboardCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className={className}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">
              {copied ? 'コピーしました' : 'クリップボードにコピー'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{copied ? 'コピーしました！' : 'クリップボードにコピー'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

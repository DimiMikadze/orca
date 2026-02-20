'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { InsightDefinition } from '@/orca-ai/types';
import { DEFAULT_INSIGHTS } from '@/orca-ai/config';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { cn } from '@/components/utils';

interface ProfileAnalysisInsightsModalProps {
  open: boolean;
  insights: InsightDefinition[];
  onSave: (insights: InsightDefinition[]) => void;
  onClose: () => void;
}

export const ProfileAnalysisInsightsModal = ({
  open,
  insights,
  onSave,
  onClose,
}: ProfileAnalysisInsightsModalProps) => {
  const [local, setLocal] = useState<InsightDefinition[]>(insights);

  const update = (index: number, field: keyof InsightDefinition, value: string) => {
    const next = [...local];
    next[index] = { ...next[index], [field]: value };
    setLocal(next);
  };

  const remove = (index: number) => {
    setLocal(local.filter((_, i) => i !== index));
  };

  const add = () => {
    setLocal([...local, { name: '', description: '' }]);
  };

  const handleSave = () => {
    const valid = local.filter((i) => i.name.trim());
    if (valid.length === 0) return;
    onSave(valid);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        className='max-w-[calc(100%-2rem)] sm:max-w-2xl lg:max-w-3xl flex flex-col gap-0 p-0 max-h-[85vh]'
        showCloseButton={false}
      >
        {/* Scrollable area — header scrolls with content */}
        <div className='flex-1 overflow-y-auto min-h-0'>
          <div className='px-6 pt-6 pb-2'>
            <DialogTitle>Customize Insights</DialogTitle>
            <DialogDescription className='mt-2'>
              Define which insights Orca should extract from the LinkedIn profile.
            </DialogDescription>
          </div>

          <div className='px-6 pb-4'>
            {local.map((insight, i) => (
              <div key={i} className='group flex gap-3 items-start pt-4'>
                {/* Border-b only on the input column so separator matches input width */}
                <div className={cn('flex-1 space-y-2 pb-4', i < local.length - 1 && 'border-b border-border')}>
                  <Input
                    value={insight.name}
                    onChange={(e) => update(i, 'name', e.target.value)}
                    placeholder='Insight name'
                    className='text-sm'
                  />
                  <AutosizeTextarea
                    value={insight.description}
                    onChange={(e) => update(i, 'description', e.target.value)}
                    placeholder='Describe what you want to learn...'
                    minHeight={52}
                    className='text-sm resize-none'
                  />
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => remove(i)}
                  className={cn(
                    'shrink-0 mt-0.5 transition-opacity text-foreground-secondary hover:text-destructive cursor-pointer',
                    local.length > 1 ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none',
                  )}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))}

            {/* flex-1 matches input column width, w-9 spacer matches delete button column */}
            <div className='flex gap-3 items-start pt-4'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={add}
                className='flex-1 border border-dashed border-border text-foreground-secondary hover:text-foreground cursor-pointer'
              >
                <Plus className='w-4 h-4' />
                Add insight
              </Button>
              <div className='w-9 shrink-0' />
            </div>
          </div>
        </div>

        <DialogFooter className='px-6 py-4 border-t border-border shrink-0 flex-row items-center'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setLocal(DEFAULT_INSIGHTS)}
            className='mr-auto text-foreground-secondary cursor-pointer'
          >
            Reset to defaults
          </Button>
          <Button variant='outline' onClick={onClose} className='cursor-pointer'>
            Cancel
          </Button>
          <Button onClick={handleSave} className='cursor-pointer'>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

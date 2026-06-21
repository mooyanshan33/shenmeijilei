import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { REPORT_REASONS, type ReportReason } from './types';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: 'post' | 'comment';
  targetId: string;
  onReport: (data: { reason: string; post_id?: string; comment_id?: string }) => Promise<void>;
}

export function ReportDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
  onReport
}: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      await onReport({
        reason: selectedReason,
        post_id: targetType === 'post' ? targetId : undefined,
        comment_id: targetType === 'comment' ? targetId : undefined
      });
      toast.success('已收到您的反馈，我们将尽快处理');
      onOpenChange(false);
      setSelectedReason('');
    } catch (e) {
      toast.error('举报失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>举报内容</DialogTitle>
          <DialogDescription>
            请选择举报原因，我们会认真审核并处理。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={selectedReason}
            onValueChange={(value) => setSelectedReason(value as ReportReason)}
          >
            {REPORT_REASONS.map((reason) => (
              <div
                key={reason.id}
                className="flex items-center space-x-3 space-y-0 py-2"
              >
                <RadioGroupItem value={reason.id} id={`reason-${reason.id}`} />
                <Label htmlFor={`reason-${reason.id}`} className="cursor-pointer">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
          >
            {isSubmitting ? '提交中...' : '提交'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Bot } from 'lucide-react';
import { Badge, Button, Input, ScrollArea, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui';
import { cn } from '@/shared/lib';
import { useAiChatSession } from '@/features/ai';
import { MarkdownMessage } from '@/components/MarkdownMessage';
import type { AiDrawerProps } from '../model/types';

const QUICK_CHIPS = [
    {
        label: 'Weather Forecast',
        prompt: 'Thời tiết tuần này có gì cần lưu ý cho mùa vụ?'
    },
    {
        label: 'Crop Recommendations',
        prompt: 'Gợi ý chăm sóc cây trồng giai đoạn hiện tại?'
    },
    {
        label: 'Pest Alerts',
        prompt: 'Dấu hiệu sâu bệnh phổ biến và cách phòng tránh?'
    },
    {
        label: 'Expense Analysis',
        prompt: 'Làm sao tối ưu chi phí phân bón và tưới tiêu?'
    },
];

/**
 * AiDrawer Component
 * 
 * Side drawer for AI assistant chat interface.
 * Provides quick access to AI features with context chips.
 * 
 * Single Responsibility: AI assistant UI
 */
export function AiDrawer({ open, onOpenChange, portalColor }: AiDrawerProps) {
    const { messages, isSending, sendMessage } = useAiChatSession({
        welcomeMessage: 'Xin chào! Tôi có thể hỗ trợ tư vấn nông nghiệp cho bạn.',
    });
    const [draft, setDraft] = useState('');
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, isSending]);

    const handleSend = () => {
        const trimmed = draft.trim();
        if (!trimmed || isSending) return;
        setDraft('');
        void sendMessage(trimmed);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:w-[480px] flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5" style={{ color: '#94D82D' }} />
                        AI Assistant
                    </SheetTitle>
                    <SheetDescription>
                        Get intelligent recommendations and insights for your farm
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 flex flex-1 flex-col gap-4 min-h-0">
                    <div className="flex flex-wrap gap-2">
                        {QUICK_CHIPS.map((chip) => (
                            <Badge
                                key={chip.label}
                                variant="outline"
                                className="cursor-pointer hover:bg-muted"
                                onClick={() => setDraft(chip.prompt)}
                            >
                                {chip.label}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex-1 min-h-0 rounded-lg border bg-muted/30">
                        <ScrollArea className="h-full">
                            <div className="space-y-3 p-4">
                                {messages.map((message) => {
                                    const isUser = message.role === 'user';
                                    return (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                'flex items-start gap-2',
                                                isUser ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            {!isUser && (
                                                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                    <Bot className="h-3.5 w-3.5" />
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    'max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                                                    isUser
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-card border'
                                                )}
                                            >
                                                {isUser ? (
                                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                                ) : (
                                                    <MarkdownMessage content={message.content} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {isSending && (
                                    <div className="flex items-start gap-2">
                                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            <Bot className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground animate-pulse">
                                            Đang trả lời...
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="relative">
                        <Input
                            placeholder="Ask me anything about your farm..."
                            className="pr-12"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isSending}
                        />
                        <Button
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            style={{ backgroundColor: portalColor }}
                            onClick={handleSend}
                            disabled={!draft.trim() || isSending}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

import { MarkdownMessage } from '@/components/MarkdownMessage';
import { useAiChatSession } from '@/features/ai';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/shared/lib';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    PageContainer,
    PageHeader,
    ScrollArea,
    Textarea,
} from '@/shared/ui';
import { Bot, Leaf, RotateCcw, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

export function AiAssistantPage() {
    const { t } = useI18n();
    const { messages, isSending, sendMessage, reset } = useAiChatSession();
    const [draft, setDraft] = useState('');
    const [cropContext, setCropContext] = useState('');
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const QUICK_PROMPTS = useMemo(() => [
        t('ai.quickPrompts.yellowLeaves'),
        t('ai.quickPrompts.tomatoWatering'),
        t('ai.quickPrompts.leafRoller'),
        t('ai.quickPrompts.cornFertilizer'),
        t('ai.quickPrompts.acidSoil'),
        t('ai.quickPrompts.watermelonHarvest'),
    ], [t]);

    const CONTEXT_TEMPLATES = useMemo(() => [
        {
            label: t('ai.contextTemplates.riceTillering.label'),
            value: t('ai.contextTemplates.riceTillering.value'),
        },
        {
            label: t('ai.contextTemplates.vegetables.label'),
            value: t('ai.contextTemplates.vegetables.value'),
        },
        {
            label: t('ai.contextTemplates.coffeeFlowering.label'),
            value: t('ai.contextTemplates.coffeeFlowering.value'),
        },
        {
            label: t('ai.contextTemplates.fruitTrees.label'),
            value: t('ai.contextTemplates.fruitTrees.value'),
        },
    ], [t]);

    const contextPreview = useMemo(() => {
        const trimmed = cropContext.trim();
        if (!trimmed) return '';
        return trimmed.length > 140 ? `${trimmed.slice(0, 140)}...` : trimmed;
    }, [cropContext]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, isSending]);

    const handleSend = () => {
        const trimmed = draft.trim();
        if (!trimmed || isSending) return;
        setDraft('');
        void sendMessage(trimmed, cropContext);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleReset = () => {
        reset();
        setDraft('');
    };

    const handleContextApply = (value: string) => {
        setCropContext((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) return value;
            if (trimmed.includes(value)) return prev;
            return `${trimmed}\n${value}`;
        });
    };

    const canReset = messages.length > 1;

    return (
        <PageContainer maxWidth="default">
            {/* --- BẮT ĐẦU PHẦN CHỈNH SỬA --- */}
            <Card className="mb-6 border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <PageHeader
                        className="mb-0"
                        icon={<Bot className="w-7 h-7" />}
                        title={t('ai.assistant.title')}
                        subtitle={t('ai.assistant.subtitle')}
                        actions={(
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                disabled={!canReset}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                {t('common.reset', 'Làm mới hội thoại')}
                            </Button>
                        )}
                    />
                </CardContent>
            </Card>
            {/* --- KẾT THÚC PHẦN CHỈNH SỬA --- */}

            <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                <Card className="flex flex-col">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Leaf className="w-4 h-4 text-primary" />
                            {t('ai.chat.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('ai.chat.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                        <ScrollArea className="h-[420px] sm:h-[520px] rounded-lg border bg-muted/30">
                            <div className="space-y-4 p-4">
                                {messages.map((message) => {
                                    const isUser = message.role === 'user';
                                    return (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                'flex items-start gap-3',
                                                isUser ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            {!isUser && (
                                                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                    <Bot className="h-4 w-4" />
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    'max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed shadow-sm',
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
                                            {isUser && (
                                                <div className="h-9 w-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                                                    <User className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {isSending && (
                                    <div className="flex items-start gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground animate-pulse">
                                            {t('ai.chat.analyzing')}
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>
                        </ScrollArea>

                        {contextPreview && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="info">{t('ai.context.label')}</Badge>
                                <span className="truncate flex-1 min-w-0">{contextPreview}</span>
                            </div>
                        )}

                        <div className="space-y-3">
                            <Textarea
                                placeholder={t('ai.chat.placeholder')}
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={3}
                                disabled={isSending}
                            />
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs text-muted-foreground">
                                    {t('ai.chat.sendHint')}
                                </p>
                                <Button onClick={handleSend} disabled={!draft.trim() || isSending}>
                                    <Send className="w-4 h-4" />
                                    {t('common.send')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Leaf className="w-4 h-4 text-primary" />
                                {t('ai.context.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('ai.context.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea
                                placeholder={t('ai.context.placeholder')}
                                value={cropContext}
                                onChange={(event) => setCropContext(event.target.value)}
                                rows={4}
                            />
                            <div className="flex flex-wrap gap-2">
                                {CONTEXT_TEMPLATES.map((template) => (
                                    <Button
                                        key={template.label}
                                        variant="outline"
                                        size="sm"
                                        className="whitespace-normal"
                                        onClick={() => handleContextApply(template.value)}
                                    >
                                        {template.label}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Sparkles className="w-4 h-4 text-primary" />
                                {t('ai.suggestions.title')}
                            </CardTitle>
                            <CardDescription>{t('ai.suggestions.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_PROMPTS.map((prompt) => (
                                    <Button
                                        key={prompt}
                                        variant="outline"
                                        size="sm"
                                        className="whitespace-normal text-left"
                                        onClick={() => setDraft(prompt)}
                                    >
                                        {prompt}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                {t('ai.scope.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('ai.scope.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>{t('ai.scope.supported')}</p>
                            <p>{t('ai.scope.notSupported')}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}

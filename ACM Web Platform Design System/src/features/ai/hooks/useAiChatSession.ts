import { useCallback, useState } from 'react';
import { useAiChat } from '@/entities/ai';

export type AiChatRole = 'assistant' | 'user';

export type AiChatMessage = {
    id: string;
    role: AiChatRole;
    content: string;
    createdAt: string;
};

type AiChatSessionOptions = {
    welcomeMessage?: string;
    fallbackMessage?: string;
};

const DEFAULT_WELCOME_MESSAGE =
    'Xin chào! Tôi là trợ lý nông nghiệp. Hãy hỏi về cây trồng, sâu bệnh, đất, tưới tiêu hoặc lịch mùa vụ.';

const DEFAULT_FALLBACK_MESSAGE =
    'Hiện tại tôi chưa thể trả lời. Vui lòng thử lại hoặc đặt câu hỏi khác liên quan đến nông nghiệp.';

const createMessage = (role: AiChatRole, content: string): AiChatMessage => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
});

export function useAiChatSession(options: AiChatSessionOptions = {}) {
    const { mutateAsync, isPending } = useAiChat();
    const welcomeMessage = options.welcomeMessage ?? DEFAULT_WELCOME_MESSAGE;
    const fallbackMessage = options.fallbackMessage ?? DEFAULT_FALLBACK_MESSAGE;

    const [messages, setMessages] = useState<AiChatMessage[]>(() => [
        createMessage('assistant', welcomeMessage),
    ]);

    const reset = useCallback(() => {
        setMessages([createMessage('assistant', welcomeMessage)]);
    }, [welcomeMessage]);

    const sendMessage = useCallback(async (userMessage: string, cropContext?: string | null) => {
        const trimmedMessage = userMessage.trim();
        if (!trimmedMessage || isPending) {
            return null;
        }

        setMessages((prev) => [...prev, createMessage('user', trimmedMessage)]);

        try {
            const response = await mutateAsync({
                userMessage: trimmedMessage,
                cropContext: cropContext?.trim() || undefined,
            });
            const assistantText = response.assistantMessage?.trim() || fallbackMessage;
            const assistantMessage = createMessage('assistant', assistantText);
            setMessages((prev) => [...prev, assistantMessage]);
            return assistantMessage;
        } catch {
            const assistantMessage = createMessage('assistant', fallbackMessage);
            setMessages((prev) => [...prev, assistantMessage]);
            return assistantMessage;
        }
    }, [fallbackMessage, isPending, mutateAsync]);

    return {
        messages,
        isSending: isPending,
        sendMessage,
        reset,
    };
}

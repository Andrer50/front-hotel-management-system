import { useMutation } from "@tanstack/react-query";
import { sendChatMessageAction, ChatMessage } from "@/core/chatbot/actions/chatbotActions";

export const useSendChatMessageMutation = () => {
    return useMutation({
        mutationFn: ({
            mensaje,
            historial,
        }: {
            mensaje: string;
            historial: ChatMessage[];
        }) => sendChatMessageAction({ mensaje, historial }),
    });
};
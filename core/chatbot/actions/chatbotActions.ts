import { apiClient } from "@/lib/http-client";

export interface ChatMessage {
    role: "user" | "model";
    text: string;
}

export interface ChatbotRequest {
    mensaje: string;
    historial: ChatMessage[];
}

export const sendChatMessageAction = async (
    request: ChatbotRequest
): Promise<string> => {
    const data = await apiClient.post<{ respuesta: string }>(
        "hotel/chatbot",
        request
    );
    return data.respuesta;
};
"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageCircle, X, Send, Loader2, Bot, User, Sparkles,
} from "lucide-react";
import { useSendChatMessageMutation } from "@/modules/chatbot/hooks/useChatbot";
import { ChatMessage } from "@/core/chatbot/actions/chatbotActions";
import { useSession } from "next-auth/react";

// ── Sugerencias por Rol ───────────────────────────────────────────────────────
export const SUGGESTIONS_BY_ROLE: Record<string, string[]> = {
    "Recepcionista": [
        "¿Cómo registro una nueva reserva?",
        "¿Cómo realizo un check-in o check-out?",
        "¿Cómo añado consumos extra y emito un comprobante?",
        "¿Cómo agendo el aforo de un área común?"
    ],
    "Limpieza": [
        "¿Dónde veo las habitaciones que debo limpiar?",
        "¿Cómo marco una habitación como 'Limpia'?",
        "¿Qué hago si una habitación tiene una incidencia reportada?"
    ],
    "Mantenimiento": [
        "¿Dónde reviso las alertas de mantenimiento activas?",
        "¿Cómo registro una nueva incidencia en el sistema?",
        "¿Cómo marco una avería como 'Resuelta'?"
    ],
    "Administrador": [
        "¿Cómo añado un nuevo miembro al personal?",
        "¿Cómo ajusto el stock de un artículo del inventario?",
        "¿Cómo modifico los permisos de un rol?",
        "¿Dónde consulto las perspectivas generadas por IA?"
    ]
};

// Obtenemos las sugerencias directamente usando la llave del rol
function getSuggestions(roleName: string | null): string[] {
    if (!roleName) return [];
    return SUGGESTIONS_BY_ROLE[roleName] || [];
}

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const sendMutation = useSendChatMessageMutation();

    const { data: session } = useSession();
    // Ya no necesitamos extraer 'permissions' aquí
    const roleName = (session?.user?.role as string) ?? null;
    const firstName = session?.user?.name?.split(" ")[0] ?? "Usuario";
    
    // Pasamos el rol directamente
    const suggestions = getSuggestions(roleName);

    // Auto-scroll al último mensaje
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus al input al abrir
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    }, [isOpen]);

    const handleSend = (text?: string) => {
        const mensaje = (text ?? input).trim();
        if (!mensaje || sendMutation.isPending) return;

        const newUserMsg: ChatMessage = { role: "user", text: mensaje };
        const updatedHistory = [...messages, newUserMsg];
        setMessages(updatedHistory);
        setInput("");

        // Historial previo (sin el mensaje actual) para el backend
        sendMutation.mutate(
            { mensaje, historial: messages },
            {
                onSuccess: (respuesta) => {
                    setMessages((prev) => [
                        ...prev,
                        { role: "model", text: respuesta },
                    ]);
                },
                onError: () => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "model",
                            text: "Ocurrió un error al procesar tu mensaje. Intenta de nuevo.",
                        },
                    ]);
                },
            }
        );
    };

    return (
        <>
            {/* ── Botón flotante ─────────────────────────────────────────────── */}
            <button
                onClick={() => setIsOpen((v) => !v)}
                className={`fixed bottom-6 left-[280px] z-50 h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${isOpen
                        ? "bg-zinc-800 rotate-90"
                        : "bg-[#031c46] hover:bg-blue-900"
                    }`}
            >
                {isOpen ? (
                    <X className="h-5 w-5 text-white" />
                ) : (
                    <MessageCircle className="h-5 w-5 text-white" />
                )}
            </button>

            {/* ── Panel del chat ─────────────────────────────────────────────── */}
            <div
                className={`fixed bottom-24 left-[280px] z-50 w-[360px] bg-white rounded-2xl shadow-2xl border border-zinc-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-left ${isOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                style={{ maxHeight: "520px" }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#031c46] to-blue-700 px-4 py-3 flex items-center gap-3">
                    <div className="bg-white/20 p-1.5 rounded-xl">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-extrabold text-sm leading-tight">
                            Astur — Asistente IA
                        </p>
                        <p className="text-white/60 text-[10px] font-semibold truncate">
                            {roleName ? `Rol: ${roleName}` : "Sin rol detectado"}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0" style={{ maxHeight: "340px" }}>
                    {/* Mensaje de bienvenida */}
                    {messages.length === 0 && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-2">
                                <div className="bg-[#031c46] p-1.5 rounded-full shrink-0 mt-0.5">
                                    <Bot className="h-3 w-3 text-white" />
                                </div>
                                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl rounded-tl-none px-3 py-2.5 text-xs text-zinc-700 leading-relaxed">
                                    Hola <strong>{firstName}</strong>, soy Astur 👋 Tu asistente
                                    para el sistema de gestión del Hotel Asturias.
                                    {roleName
                                        ? ` Estoy configurado para ayudarte con las funciones de tu rol: **${roleName}**.`
                                        : " No detecté un rol en tu cuenta, contacta al administrador."}
                                </div>
                            </div>

                            {/* Chips de sugerencia */}
                            {suggestions.length > 0 && (
                                <div className="flex flex-col gap-1.5 pl-8">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                        Sugerencias rápidas
                                    </p>
                                    {suggestions.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleSend(s)}
                                            className="text-left text-xs font-semibold text-brand-blue bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl px-3 py-2 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Historial de mensajes */}
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""
                                }`}
                        >
                            <div
                                className={`p-1.5 rounded-full shrink-0 mt-0.5 ${msg.role === "user"
                                        ? "bg-brand-blue"
                                        : "bg-[#031c46]"
                                    }`}
                            >
                                {msg.role === "user" ? (
                                    <User className="h-3 w-3 text-white" />
                                ) : (
                                    <Bot className="h-3 w-3 text-white" />
                                )}
                            </div>
                            <div
                                className={`rounded-2xl px-3 py-2.5 text-xs leading-relaxed max-w-[80%] whitespace-pre-wrap ${msg.role === "user"
                                        ? "bg-brand-blue text-white rounded-tr-none"
                                        : "bg-zinc-50 border border-zinc-100 text-zinc-700 rounded-tl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Indicador de escritura */}
                    {sendMutation.isPending && (
                        <div className="flex items-start gap-2">
                            <div className="bg-[#031c46] p-1.5 rounded-full shrink-0 mt-0.5">
                                <Bot className="h-3 w-3 text-white" />
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl rounded-tl-none px-3 py-2.5 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="border-t border-zinc-100 px-3 py-2.5 flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Escribe tu pregunta..."
                        className="flex-1 text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-brand-blue transition-colors placeholder:text-zinc-400"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || sendMutation.isPending}
                        className="h-8 w-8 rounded-xl bg-[#031c46] hover:bg-blue-900 disabled:opacity-40 flex items-center justify-center transition-all shrink-0"
                    >
                        {sendMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                        ) : (
                            <Send className="h-3.5 w-3.5 text-white" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
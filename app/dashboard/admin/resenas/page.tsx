"use client";

import { useState, useMemo } from "react";
import {
  Star,
  Search,
  MessageSquare,
  Plus,
  Loader2,
  Reply,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Smile,
  Frown,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSessionContext } from "@/context/session-context";
import { useGetResenasQuery, useGetResenaPromedioQuery } from "@/modules/resena/domain/hooks/useResenaQueries";
import { useModerarResenaMutation } from "@/modules/resena/domain/hooks/useResenaMutations";
import { CreateResenaDialog } from "@/presentation/dashboard/admin/resenas/create-resena-dialog";
import { ReplyResenaDialog } from "@/presentation/dashboard/admin/resenas/reply-resena-dialog";
import { Resena } from "@/core/resena/interfaces";

export default function ResenasManagementPage() {
  const { session } = useSessionContext();
  const isAdmin = session?.user?.role === "Administrador";

  const { data: resenas = [], isLoading: isLoadingResenas } = useGetResenasQuery();
  const { data: promedioData } = useGetResenaPromedioQuery();
  const moderarMutation = useModerarResenaMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [selectedResena, setSelectedResena] = useState<Resena | null>(null);

  // Filtros de búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<"ALL" | "GOOD" | "CRITICAL">("ALL");
  const [replyFilter, setReplyFilter] = useState<"ALL" | "ANSWERED" | "UNANSWERED">("ALL");
  const [moderationFilter, setModerationFilter] = useState<"ALL" | "NORMAL" | "INAPPROPRIATE">("ALL");

  const averageRating = promedioData?.promedio ?? 0;

  // Filtrar reseñas localmente
  const filteredResenas = useMemo(() => {
    return resenas.filter((resena) => {
      // Búsqueda por texto
      const matchesSearch =
        resena.huesped_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resena.comentario.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por valoración (Buenas: >3, Críticas: <=3)
      const matchesRating =
        ratingFilter === "ALL" ||
        (ratingFilter === "GOOD" && resena.calificacion > 3) ||
        (ratingFilter === "CRITICAL" && resena.calificacion <= 3);

      // Filtro por respuesta
      const matchesReply =
        replyFilter === "ALL" ||
        (replyFilter === "ANSWERED" && !!resena.respuesta_administrador) ||
        (replyFilter === "UNANSWERED" && !resena.respuesta_administrador);

      // Filtro por moderación
      const matchesModeration =
        moderationFilter === "ALL" ||
        (moderationFilter === "NORMAL" && !resena.es_inapropiada) ||
        (moderationFilter === "INAPPROPRIATE" && resena.es_inapropiada);

      return matchesSearch && matchesRating && matchesReply && matchesModeration;
    });
  }, [resenas, searchQuery, ratingFilter, replyFilter, moderationFilter]);

  // KPIs calculados
  const kpis = useMemo(() => {
    const total = filteredResenas.length;
    const answered = filteredResenas.filter((r) => !!r.respuesta_administrador).length;
    const unanswered = total - answered;
    const inappropriate = filteredResenas.filter((r) => r.es_inapropiada).length;
    
    // Calcular porcentaje de respuestas
    const replyRate = total > 0 ? ((answered / total) * 100).toFixed(0) : "0";

    return { total, answered, unanswered, replyRate, inappropriate };
  }, [filteredResenas]);

  const handleModerationToggle = (resena: Resena) => {
    const newStatus = !resena.es_inapropiada;
    moderarMutation.mutate(
      { id: resena.id, es_inapropiada: newStatus },
      {
        onSuccess: () => {
          toast.success(newStatus ? "Reseña marcada inapropiada" : "Reseña restaurada", {
            description: newStatus
              ? "La reseña ya no será pública en el listado ni sumará para el promedio."
              : "La reseña vuelve a estar visible públicamente.",
          });
        },
        onError: (err) => {
          toast.error("Error al moderar reseña", {
            description: err.message || "No se pudo actualizar el estado de moderación.",
          });
        },
      }
    );
  };

  const handleOpenReply = (resena: Resena) => {
    setSelectedResena(resena);
    setIsReplyOpen(true);
  };

  if (isLoadingResenas) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-dark-secondary italic animate-pulse">
          Sincronizando reseñas y comentarios con el servidor...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-dark-secondary/60">
            <span>OPERACIONES</span>
            <span className="text-zinc-300 font-light">&gt;</span>
            <span className="text-brand-blue">RESEÑAS Y COMENTARIOS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-dark-primary tracking-tight">
            Reseñas & Feedback
          </h1>
          <p className="text-xs text-dark-secondary font-medium">
            Gestiona la reputación del hotel, responde al feedback y modera comentarios inapropiados.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl h-10 px-4 flex items-center gap-1.5 shadow-md shadow-brand-blue/15 w-fit"
        >
          <Plus className="h-4 w-4" />
          Nueva Reseña
        </Button>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Promedio */}
        <Card className="border-zinc-100 overflow-hidden relative group hover:shadow-md transition-shadow">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-amber-500/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold tracking-wider uppercase text-dark-secondary">
              Promedio General
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-dark-primary tracking-tight">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-dark-secondary font-bold">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4.5 w-4.5 ${
                    s <= Math.round(averageRating) ? "fill-amber-400" : "text-zinc-200"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* KPI: Total reseñas */}
        <Card className="border-zinc-100 overflow-hidden relative group hover:shadow-md transition-shadow">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-brand-blue/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold tracking-wider uppercase text-dark-secondary">
              Total Reseñas
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-black text-dark-primary tracking-tight">
              {kpis.total}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-brand-blue font-bold mt-1">
              <Smile className="h-4 w-4" />
              <span>Feedback total recibido</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI: Tasa de Respuesta */}
        <Card className="border-zinc-100 overflow-hidden relative group hover:shadow-md transition-shadow">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-green-500/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold tracking-wider uppercase text-dark-secondary">
              Tasa de Respuesta
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-black text-dark-primary tracking-tight text-green-600">
              {kpis.replyRate}%
            </span>
            <span className="text-xs text-dark-secondary font-medium">
              {kpis.answered} respondidas · {kpis.unanswered} pendientes
            </span>
          </CardContent>
        </Card>

        {/* KPI: Moderadas/Inapropiadas */}
        <Card className="border-zinc-100 overflow-hidden relative group hover:shadow-md transition-shadow">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-red-500/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold tracking-wider uppercase text-dark-secondary">
              Moderadas (Inapropiadas)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-black text-dark-primary tracking-tight text-red-500">
              {kpis.inappropriate}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold mt-1">
              <ShieldAlert className="h-4 w-4" />
              <span>Ocultas de la vista pública</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Filtros */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Búsqueda */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por huésped o comentario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs rounded-xl border-zinc-200 h-10 w-full"
          />
        </div>

        {/* Combos */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Calificación */}
          <div className="flex flex-col gap-1 min-w-[130px]">
            <Select value={ratingFilter} onValueChange={(val: any) => setRatingFilter(val)}>
              <SelectTrigger className="text-xs rounded-xl border-zinc-200 h-10 bg-white">
                <SelectValue placeholder="Valoración" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL" className="text-xs">Todas las valoraciones</SelectItem>
                <SelectItem value="GOOD" className="text-xs">Buenas (&gt; 3 ★)</SelectItem>
                <SelectItem value="CRITICAL" className="text-xs">Críticas (≤ 3 ★)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Respuesta */}
          <div className="flex flex-col gap-1 min-w-[130px]">
            <Select value={replyFilter} onValueChange={(val: any) => setReplyFilter(val)}>
              <SelectTrigger className="text-xs rounded-xl border-zinc-200 h-10 bg-white">
                <SelectValue placeholder="Respuesta" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL" className="text-xs">Todas las respuestas</SelectItem>
                <SelectItem value="ANSWERED" className="text-xs">Respondidas</SelectItem>
                <SelectItem value="UNANSWERED" className="text-xs">Sin responder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Moderación */}
          <div className="flex flex-col gap-1 min-w-[130px]">
            <Select value={moderationFilter} onValueChange={(val: any) => setModerationFilter(val)}>
              <SelectTrigger className="text-xs rounded-xl border-zinc-200 h-10 bg-white">
                <SelectValue placeholder="Moderación" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL" className="text-xs">Todo el estado</SelectItem>
                <SelectItem value="NORMAL" className="text-xs">Normales (Públicas)</SelectItem>
                <SelectItem value="INAPPROPRIATE" className="text-xs">Ocultas (Inapropiadas)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Feed de Reseñas */}
      {filteredResenas.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-zinc-200 text-center flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <div className="bg-zinc-50 p-4 rounded-full text-zinc-400">
            <MessageCircle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-dark-primary">No se encontraron reseñas</h3>
            <p className="text-xs text-dark-secondary mt-1 max-w-xs mx-auto">
              Prueba cambiando los criterios de los filtros o registra una nueva reseña para esta sucursal.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="outline"
            className="text-xs rounded-xl border-zinc-200 font-bold"
          >
            Crear primera reseña
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredResenas.map((resena) => {
            const initials = resena.huesped_nombre
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            const isCritical = resena.calificacion <= 3;
            const dateStr = new Date(resena.fecha_creacion).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={resena.id}
                className={`border-zinc-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative ${
                  resena.es_inapropiada ? "bg-red-50/20 border-red-100" : "bg-white"
                }`}
              >
                {/* Indicador de estado de moderación */}
                {resena.es_inapropiada && (
                  <div className="absolute right-0 top-0 bg-red-500 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-bl-xl uppercase flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    <span>Inapropiada · Oculta</span>
                  </div>
                )}

                <CardHeader className="flex flex-row items-start gap-4 pb-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-dark-secondary text-xs border border-zinc-200/50">
                    {initials}
                  </div>

                  {/* Datos del Huesped & Rating */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-dark-primary text-xs leading-none">
                        {resena.huesped_nombre}
                      </span>
                      <span className="text-[10px] text-dark-secondary font-medium leading-none">
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= resena.calificacion ? "fill-amber-400" : "text-zinc-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  {/* Comentario */}
                  <p className="text-xs text-dark-secondary leading-relaxed pl-14">
                    {resena.comentario || <span className="italic text-zinc-400">Sin comentario escrito.</span>}
                  </p>

                  {/* Respuesta del Administrador */}
                  {resena.respuesta_administrador ? (
                    <div className="ml-14 bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-widest">
                          Respuesta del Administrador
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-xs text-dark-primary font-medium leading-relaxed italic">
                        "{resena.respuesta_administrador}"
                      </p>
                    </div>
                  ) : (
                    !resena.es_inapropiada && (
                      <div className="ml-14 text-[11px] font-bold text-amber-600 bg-amber-50/50 px-3.5 py-2 rounded-xl w-fit flex items-center gap-1.5 border border-amber-100/50">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Reseña pendiente de respuesta oficial.</span>
                      </div>
                    )
                  )}

                  {/* Botones de Acción (Staff / Admin) */}
                  <div className="ml-14 pt-2 border-t border-zinc-100/80 flex items-center gap-2">
                    {/* Botón Responder (Admin) */}
                    {isAdmin && (
                      <Button
                        variant="outline"
                        onClick={() => handleOpenReply(resena)}
                        className="text-[11px] rounded-xl border-zinc-200 h-8 font-bold px-3 text-dark-secondary hover:text-dark-primary flex items-center gap-1 bg-white cursor-pointer"
                      >
                        <Reply className="h-3.5 w-3.5" />
                        {resena.respuesta_administrador ? "Editar Respuesta" : "Responder"}
                      </Button>
                    )}

                    {/* Botón Moderar (Admin) */}
                    {isAdmin && (
                      <Button
                        variant="outline"
                        onClick={() => handleModerationToggle(resena)}
                        disabled={moderarMutation.isPending}
                        className={`text-[11px] rounded-xl h-8 font-bold px-3 flex items-center gap-1 bg-white cursor-pointer ${
                          resena.es_inapropiada
                            ? "border-green-200 text-green-600 hover:text-green-700 hover:bg-green-50/50"
                            : "border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50/50"
                        }`}
                      >
                        {moderarMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : resena.es_inapropiada ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Restaurar Pública</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Marcar Inapropiada</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Diálogos */}
      <CreateResenaDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <ReplyResenaDialog
        isOpen={isReplyOpen}
        onOpenChange={setIsReplyOpen}
        resena={selectedResena}
      />
    </div>
  );
}

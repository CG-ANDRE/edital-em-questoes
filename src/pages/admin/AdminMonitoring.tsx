import AdminLayout from "@/components/admin/AdminLayout";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { systemMetrics, systemLogs } from "@/data/adminMockData";
import { Activity, Clock, Database, HardDrive, AlertTriangle, CheckCircle, Wifi, Upload, Zap, Server } from "lucide-react";

export default function AdminMonitoring() {
  const storagePercent = (systemMetrics.storageUsed / systemMetrics.storageTotal) * 100;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Monitoramento & Performance</h1>

        {/* Alerts */}
        {(systemMetrics.avgLatency > 150 || systemMetrics.errorsLast24h > 0) && (
          <div className="space-y-2">
            {systemMetrics.avgLatency > 150 && (
              <div className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800">Latência acima do ideal: {systemMetrics.avgLatency}ms (ideal &lt; 150ms)</span>
              </div>
            )}
            {systemMetrics.errorsLast24h > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">{systemMetrics.errorsLast24h} erro(s) nas últimas 24h</span>
              </div>
            )}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <AdminStatsCard title="Latência Média" value={`${systemMetrics.avgLatency}ms`} icon={Zap} />
          <AdminStatsCard title="Tempo Carregamento" value={`${systemMetrics.avgPageLoad}s`} icon={Clock} />
          <AdminStatsCard title="Tempo Resposta" value={`${systemMetrics.avgResponseTime}s`} icon={Activity} />
          <AdminStatsCard title="Uptime" value={`${systemMetrics.uptime}%`} icon={Server} />
          <AdminStatsCard title="Fila Processamento" value={systemMetrics.processingQueue} icon={Upload} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Storage */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><HardDrive className="h-4 w-4" />Armazenamento</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Progress value={storagePercent} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{systemMetrics.storageUsed} GB usado</span>
                <span>{systemMetrics.storageTotal} GB total</span>
              </div>
              <div className="text-sm"><span className="font-medium">{systemMetrics.totalUploads}</span> uploads realizados</div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Database className="h-4 w-4" />Status dos Serviços</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm"><span>Banco de Dados</span><AdminStatusBadge status={systemMetrics.dbStatus} /></div>
              <div className="flex items-center justify-between text-sm"><span>Autenticação</span><AdminStatusBadge status="healthy" /></div>
              <div className="flex items-center justify-between text-sm"><span>Storage</span><AdminStatusBadge status="healthy" /></div>
              <div className="flex items-center justify-between text-sm"><span>Processamento</span><AdminStatusBadge status={systemMetrics.processingQueue > 0 ? "processing" : "healthy"} /></div>
            </CardContent>
          </Card>
        </div>

        {/* Logs */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Logs Recentes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                  <AdminStatusBadge status={log.level} />
                  <div className="flex-1 min-w-0">
                    <p>{log.message}</p>
                    <p className="text-xs text-muted-foreground">{log.source} • {new Date(log.timestamp).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

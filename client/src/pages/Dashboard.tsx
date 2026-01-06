import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { documentService, Document } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    pending: 0,
    errors: 0
  });

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Em um cenário real, isso viria da API
      // const docs = await documentService.getAll();
      
      // Mock data para visualização inicial
      const docs: Document[] = [
        { id: "1", fileName: "balanco_2024.pdf", cnpj: "12345678000190", isProcessed: true, iteraStatus: "Concluido", createdAt: "2024-01-15T10:30:00Z" },
        { id: "2", fileName: "dre_q1.pdf", cnpj: "98765432000150", isProcessed: true, iteraStatus: "Concluido", createdAt: "2024-01-15T11:45:00Z" },
        { id: "3", fileName: "notas_fiscais.pdf", cnpj: "12345678000190", isProcessed: false, iteraStatus: "Processando", createdAt: "2024-01-16T09:15:00Z" },
        { id: "4", fileName: "relatorio_anual.pdf", cnpj: "45678912000130", isProcessed: false, iteraStatus: "Pendente", createdAt: "2024-01-16T14:20:00Z" },
        { id: "5", fileName: "balancete_erro.pdf", cnpj: "98765432000150", isProcessed: false, iteraStatus: "Erro", errorMessage: "Formato inválido", createdAt: "2024-01-14T16:00:00Z" },
      ];
      
      setDocuments(docs);
      
      // Calcular estatísticas
      setStats({
        total: docs.length,
        processed: docs.filter(d => d.iteraStatus === "Concluido").length,
        pending: docs.filter(d => d.iteraStatus === "Pendente" || d.iteraStatus === "Processando").length,
        errors: docs.filter(d => d.iteraStatus === "Erro").length
      });
    } catch (error) {
      console.error("Erro ao buscar documentos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Visão geral do processamento de documentos.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchDocuments} disabled={loading}>
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Atualizar
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Novo Processamento
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 desde a última hora
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Taxa de sucesso de {stats.total > 0 ? Math.round((stats.processed / stats.total) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Processamento</CardTitle>
              <Activity className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Aguardando finalização
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erros</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.errors}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requer atenção
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Processamentos Recentes</CardTitle>
              <CardDescription>
                Últimos documentos enviados para a API Itera.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border",
                        doc.iteraStatus === "Concluido" ? "bg-chart-2/10 border-chart-2/20 text-chart-2" :
                        doc.iteraStatus === "Erro" ? "bg-destructive/10 border-destructive/20 text-destructive" :
                        "bg-chart-3/10 border-chart-3/20 text-chart-3"
                      )}>
                        {doc.iteraStatus === "Concluido" ? <CheckCircle2 className="w-5 h-5" /> :
                         doc.iteraStatus === "Erro" ? <AlertCircle className="w-5 h-5" /> :
                         <Activity className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground mt-1">CNPJ: {doc.cnpj}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full inline-block mb-1",
                        doc.iteraStatus === "Concluido" ? "bg-chart-2/10 text-chart-2" :
                        doc.iteraStatus === "Erro" ? "bg-destructive/10 text-destructive" :
                        "bg-chart-3/10 text-chart-3"
                      )}>
                        {doc.iteraStatus}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
              <CardDescription>
                Monitoramento da conexão com API Itera.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
                    <span className="text-sm font-medium">API Itera</span>
                  </div>
                  <span className="text-xs text-chart-2 font-medium bg-chart-2/10 px-2 py-1 rounded">Online</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tempo de Resposta</span>
                    <span className="font-medium">124ms</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-chart-2 w-[85%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Taxa de Sucesso (24h)</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-chart-3 w-[98%]" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Últimos Eventos</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-xs">
                      <span className="text-muted-foreground w-12">10:45</span>
                      <span>Token JWT renovado com sucesso</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-muted-foreground w-12">10:30</span>
                      <span>Lote #492 processado (15 docs)</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-muted-foreground w-12">09:15</span>
                      <span className="text-destructive">Falha no upload: Formato inválido</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

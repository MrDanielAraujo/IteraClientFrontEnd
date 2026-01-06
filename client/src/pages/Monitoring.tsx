import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Search,
  Download,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Document } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function MonitoringPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulação de dados e atualização em tempo real
  useEffect(() => {
    // Dados iniciais
    const initialDocs: Document[] = [
      { id: "1", fileName: "balanco_2024.pdf", cnpj: "12345678000190", isProcessed: true, iteraStatus: "Concluido", createdAt: "2024-01-15T10:30:00Z" },
      { id: "2", fileName: "dre_q1.pdf", cnpj: "98765432000150", isProcessed: true, iteraStatus: "Concluido", createdAt: "2024-01-15T11:45:00Z" },
      { id: "3", fileName: "notas_fiscais_jan.pdf", cnpj: "12345678000190", isProcessed: false, iteraStatus: "Processando", createdAt: "2024-01-16T09:15:00Z" },
      { id: "4", fileName: "notas_fiscais_fev.pdf", cnpj: "12345678000190", isProcessed: false, iteraStatus: "Processando", createdAt: "2024-01-16T09:16:00Z" },
      { id: "5", fileName: "relatorio_anual.pdf", cnpj: "45678912000130", isProcessed: false, iteraStatus: "Pendente", createdAt: "2024-01-16T14:20:00Z" },
      { id: "6", fileName: "balancete_erro.pdf", cnpj: "98765432000150", isProcessed: false, iteraStatus: "Erro", errorMessage: "Formato inválido", createdAt: "2024-01-14T16:00:00Z" },
    ];
    setDocuments(initialDocs);

    // Polling simulado
    const interval = setInterval(() => {
      if (!autoRefresh) return;
      
      setDocuments(prev => prev.map(doc => {
        // Simular mudança de status aleatória para demonstração
        if (doc.iteraStatus === "Pendente") return { ...doc, iteraStatus: "Processando" };
        if (doc.iteraStatus === "Processando" && Math.random() > 0.7) return { ...doc, iteraStatus: "Concluido", isProcessed: true };
        return doc;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.cnpj.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Concluido":
        return <Badge className="bg-chart-2 hover:bg-chart-2/90 text-white border-none">Concluído</Badge>;
      case "Processando":
        return <Badge className="bg-chart-3 hover:bg-chart-3/90 text-white border-none animate-pulse">Processando</Badge>;
      case "Pendente":
        return <Badge variant="outline" className="text-muted-foreground">Pendente</Badge>;
      case "Erro":
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluido": return <CheckCircle2 className="w-4 h-4 text-chart-2" />;
      case "Processando": return <Loader2 className="w-4 h-4 text-chart-3 animate-spin" />;
      case "Pendente": return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "Erro": return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Monitoramento</h1>
            <p className="text-muted-foreground mt-1">Acompanhe o status de processamento em tempo real.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
              <div className={cn("w-2 h-2 rounded-full", autoRefresh ? "bg-chart-2 animate-pulse" : "bg-muted")} />
              {autoRefresh ? "Atualização automática" : "Pausado"}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "Pausar" : "Retomar"}
            </Button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do arquivo ou CNPJ..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm">Filtros</Button>
            <Button variant="outline" size="sm">Exportar Lista</Button>
          </div>
        </div>

        {/* Tabela de Documentos */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Arquivo</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Data Envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs.map((doc) => (
                    <TableRow key={doc.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-muted/50 text-muted-foreground group-hover:text-primary transition-colors">
                            {getStatusIcon(doc.iteraStatus || "")}
                          </div>
                          <span className="truncate max-w-[250px]" title={doc.fileName}>{doc.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{doc.cnpj}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(doc.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(doc.iteraStatus || "")}
                        {doc.errorMessage && (
                          <p className="text-xs text-destructive mt-1 max-w-[200px] truncate" title={doc.errorMessage}>
                            {doc.errorMessage}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver Detalhes">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            disabled={!doc.isProcessed}
                            title="Baixar Resultados"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload as UploadIcon, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { documentService } from "@/lib/api";

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: "",
    source: "Portal Web",
    description: ""
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type === "application/pdf"
      );
      
      if (newFiles.length !== e.dataTransfer.files.length) {
        toast.warning("Apenas arquivos PDF são permitidos.");
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type === "application/pdf"
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Selecione pelo menos um arquivo.");
      return;
    }

    if (!formData.cnpj) {
      toast.error("CNPJ é obrigatório.");
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Processamento em lote simulado (um por um para feedback)
      for (const file of files) {
        try {
          // Converter para base64 para simular o endpoint de batch ou usar o endpoint de upload direto
          // Aqui vamos simular o sucesso
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulação de delay
          
          // Em produção:
          // await documentService.upload(file, formData.cnpj, formData.source, formData.description);
          
          successCount++;
        } catch (error) {
          console.error(error);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        toast.success(`${successCount} documentos enviados com sucesso!`);
        setFiles([]);
        setFormData({ ...formData, description: "" });
        // Redirecionar para monitoramento após breve delay
        setTimeout(() => setLocation("/monitoring"), 1500);
      } else {
        toast.warning(`${successCount} enviados, ${errorCount} falharam.`);
      }
    } catch (error) {
      toast.error("Erro ao processar upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload de Documentos</h1>
          <p className="text-muted-foreground mt-1">Envie arquivos PDF para processamento na Itera.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Formulário de Metadados */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Lote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ da Empresa *</Label>
                <Input 
                  id="cnpj" 
                  placeholder="00.000.000/0001-00" 
                  value={formData.cnpj}
                  onChange={e => setFormData({...formData, cnpj: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Input 
                  id="source" 
                  value={formData.source}
                  onChange={e => setFormData({...formData, source: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Ex: Balanços 2024" 
                  className="resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Área de Upload */}
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                  isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
                  files.length > 0 ? "h-auto" : "h-64 flex flex-col items-center justify-center"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  multiple 
                  accept=".pdf" 
                  className="hidden"
                  onChange={handleFileSelect}
                />
                
                {files.length === 0 ? (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <UploadIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Arraste arquivos PDF aqui</h3>
                    <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar do computador</p>
                    <Button variant="outline" size="sm">Selecionar Arquivos</Button>
                  </>
                ) : (
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-sm text-muted-foreground">{files.length} arquivos selecionados</h3>
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={(e) => {
                        e.stopPropagation();
                        setFiles([]);
                      }}>
                        Limpar tudo
                      </Button>
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-background border border-border rounded-md text-left group" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 mt-4 border-t border-border flex justify-end gap-3" onClick={e => e.stopPropagation()}>
                      <Button variant="outline" onClick={() => setFiles([])}>Cancelar</Button>
                      <Button onClick={handleUpload} disabled={uploading}>
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <UploadIcon className="w-4 h-4 mr-2" />
                            Enviar {files.length} Arquivos
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

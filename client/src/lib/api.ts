import axios from 'axios';

// Configuração base da API
// Em produção, isso viria de uma variável de ambiente
const API_BASE_URL = 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('itera_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos baseados na documentação
export interface Document {
  id: string;
  fileName: string;
  contentBase64?: string;
  contentType?: string;
  cnpj: string;
  source?: string;
  description?: string;
  iteraDocumentId?: string;
  iteraStatus?: string;
  isProcessed: boolean;
  createdAt: string;
  updatedAt?: string;
  errorMessage?: string;
}

export interface DocumentExportResult {
  id: string;
  documentId: string;
  codigo: string;
  valor: string;
  empresa: string;
  cnpj: string;
  data: string;
  tipo_balanco: string;
  [key: string]: any; // Para outros campos dinâmicos
}

export interface BatchProcessResponse {
  totalDocuments: number;
  successCount: number;
  errorCount: number;
  processingCount: number;
  documentStatuses: Array<{
    documentId: string;
    iteraDocumentId: string;
    fileName: string;
    status: string;
    isSuccess: boolean;
    isProcessing: boolean;
    exportedResultsCount: number;
  }>;
  isSuccess: boolean;
  message: string;
}

export interface UploadResponse {
  id: string;
  fileName: string;
  cnpj: string;
  source: string;
  description: string;
  createdAt: string;
}

// Serviços da API
export const authService = {
  getAccessToken: async () => {
    const response = await api.get('/Itera/GetAccessToken');
    return response.data; // Retorna o token string
  },
};

export const documentService = {
  // Upload de um único documento
  upload: async (file: File, cnpj: string, source?: string, description?: string) => {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Cnpj', cnpj);
    if (source) formData.append('Source', source);
    if (description) formData.append('Description', description);

    const response = await api.post('/Itera/UploadDocument', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Adicionar documento ao banco local (sem enviar para Itera ainda)
  addDocument: async (doc: Partial<Document>) => {
    const response = await api.post('/DocumentProcessing/Documents', doc);
    return response.data;
  },

  // Adicionar lote de documentos
  addBatch: async (docs: Partial<Document>[]) => {
    const response = await api.post('/DocumentProcessing/Documents/Batch', docs);
    return response.data;
  },

  // Listar todos os documentos
  getAll: async () => {
    const response = await api.get<Document[]>('/DocumentProcessing/Documents');
    return response.data;
  },

  // Obter detalhes de um documento
  getById: async (id: string) => {
    const response = await api.get<Document>(`/DocumentProcessing/Documents/${id}`);
    return response.data;
  },

  // Processar lote
  processBatch: async (documentIds: string[], waitForCompletion = false) => {
    const response = await api.post<BatchProcessResponse>('/DocumentProcessing/ProcessBatch', {
      documentIds,
      waitForCompletion,
      timeoutSeconds: 300,
      pollingIntervalSeconds: 5
    });
    return response.data;
  },

  // Verificar status
  getStatus: async (documentId: string) => {
    const response = await api.get(`/DocumentProcessing/Status/${documentId}`);
    return response.data; // Retorna string de status
  },

  // Obter resultados exportados
  getExport: async (documentId: string) => {
    const response = await api.get(`/DocumentProcessing/Export/${documentId}`);
    return response.data;
  }
};

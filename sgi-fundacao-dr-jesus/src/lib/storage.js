import { api } from './api';

/**
 * Módulo de Storage Soberano (Substituto do Supabase Storage).
 * Envia arquivos multipart diretamente para o backend Django com rastreamento de progresso.
 *
 * @param {Object} params
 * @param {File} params.file - Arquivo a ser enviado
 * @param {string} params.titulo - Título ou nome amigável do documento
 * @param {string} [params.tipo_documento] - Tipo: "laudo", "termo", "identidade", "receita", "foto", "outro"
 * @param {string} [params.paciente_id] - ID do paciente associado (opcional)
 * @param {string} [params.prontuario_id] - ID do prontuário associado (opcional)
 * @param {Function} [params.onProgress] - Callback de progresso percentual: (percent) => void
 * @returns {Promise<Object>} Dados do documento salvo incluindo URL de acesso
 */
export async function uploadDocumento({
  file,
  titulo,
  tipo_documento = 'outro',
  paciente_id = null,
  prontuario_id = null,
  onProgress = null,
}) {
  if (!file) {
    throw new Error('Nenhum arquivo informado para upload.');
  }

  const formData = new FormData();
  formData.append('arquivo', file);
  formData.append('titulo', titulo || file.name);
  formData.append('tipo_documento', tipo_documento);

  if (paciente_id) formData.append('paciente', paciente_id);
  if (prontuario_id) formData.append('prontuario', prontuario_id);

  const response = await api.post('/storage/documentos/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
}

/**
 * Lista os documentos anexos associados a um paciente ou prontuário.
 */
export async function listarDocumentos({ paciente_id, prontuario_id } = {}) {
  const params = {};
  if (paciente_id) params.paciente = paciente_id;
  if (prontuario_id) params.prontuario = prontuario_id;

  const response = await api.get('/storage/documentos/', { params });
  return response.data;
}

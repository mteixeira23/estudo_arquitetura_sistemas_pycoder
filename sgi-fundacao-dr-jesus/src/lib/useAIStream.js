import { useState, useRef, useCallback } from 'react';
import { getApiBaseUrl } from './api';

/**
 * Hook reativo para consumo de endpoints de Streaming Cognitivo (Fase 4 - SCSI).
 * Gerencia o ciclo de vida do ReadableStream, controle de cancelamento (AbortController)
 * e o estado reativo do texto gerado token a token.
 */
export function useAIStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  /**
   * Dispara uma consulta à IA em modo streaming (token a token).
   * @param {string} endpoint - Rota relativa (ex: '/ia/chat/stream/' ou '/ia/prontuario/:id/stream/')
   * @param {object} payload - Dados da requisição (ex: { prompt: '...' } ou { pergunta: '...' })
   * @param {object} options - Callbacks opcionais { onChunk, onFinish, onError }
   */
  const iniciarStream = useCallback(async (endpoint, payload, options = {}) => {
    // Cancela qualquer stream anterior em andamento
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsStreaming(true);
    setStreamedText('');
    setError(null);

    const token = localStorage.getItem('access_token');
    const url = `${getApiBaseUrl()}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      if (!response.ok) {
        let mensagemErro = `Erro na requisição (${response.status})`;
        try {
          const erroJson = await response.json();
          mensagemErro = erroJson.erro || mensagemErro;
        } catch {
          // Ignora se não for JSON
        }
        throw new Error(mensagemErro);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let acumulado = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        acumulado += chunk;
        setStreamedText(acumulado);

        if (options.onChunk) {
          options.onChunk(chunk, acumulado);
        }
      }

      setIsStreaming(false);
      if (options.onFinish) {
        options.onFinish(acumulado);
      }
      return acumulado;

    } catch (err) {
      if (err.name === 'AbortError') {
        console.info('[SCSI IA Stream] Fluxo interrompido pelo usuário.');
      } else {
        console.error('[SCSI IA Stream] Erro durante o streaming:', err);
        setError(err.message || 'Erro de comunicação com a IA.');
        if (options.onError) {
          options.onError(err);
        }
      }
      setIsStreaming(false);
      return null;
    } finally {
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Interrompe imediatamente o streaming em andamento.
   */
  const cancelarStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  /**
   * Limpa o texto e os estados de erro.
   */
  const limpar = useCallback(() => {
    setStreamedText('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return {
    isStreaming,
    streamedText,
    error,
    iniciarStream,
    cancelarStream,
    limpar,
  };
}

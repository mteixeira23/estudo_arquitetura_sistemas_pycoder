import { useEffect, useRef, useCallback } from 'react';
import { getApiBaseUrl } from './api';

/**
 * Hook de conexão WebSocket para eventos em tempo real (Django Channels / SCSI).
 *
 * Blindagens da Sabatina 3.3:
 * - Autenticação in-band com token JWT (sem vazar credencial na query string da URL).
 * - Heartbeat periódico (ping a cada 30s) para mitigar corte de conexões ociosas pelo Traefik/Cloudflare (timeout de 100s).
 * - Reconexão exponencial automática com teto de 15s.
 *
 * @param {Object} options
 * @param {string} [options.topic] - Tópico específico de inscrição (ex: "almoxarifado", "pacientes")
 * @param {Function} [options.onMessage] - Callback para mensagens gerais
 * @param {Function} [options.onTableChange] - Callback filtrado: (event, table, record) => void
 */
export function useRealtime({ topic, onMessage, onTableChange } = {}) {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const reconnectDelayRef = useRef(1000);

  const connect = useCallback(() => {
    try {
      const httpUrl = getApiBaseUrl();
      const wsProtocol = httpUrl.startsWith('https') ? 'wss:' : 'ws:';
      const host = httpUrl.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '');
      const wsUrl = `${wsProtocol}//${host}/ws/realtime/`;

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.info('[SCSI Realtime] WebSocket conectado com sucesso.');
        reconnectDelayRef.current = 1000;

        // 1. Autenticação in-band: envia token JWT se disponível
        const token = localStorage.getItem('access_token');
        if (token) {
          ws.send(JSON.stringify({ type: 'authenticate', token }));
        }

        // 2. Assinatura de tópico específico se solicitado
        if (topic) {
          ws.send(JSON.stringify({ type: 'subscribe', topic }));
        }

        // 3. Heartbeat periódico: ping a cada 30s para evitar timeout de borda (Cloudflare 100s)
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Ignora respostas silenciosas de pong
          if (data.type === 'pong') return;

          if (onMessage) {
            onMessage(data);
          }

          // Dispara callback de mutação de entidade (INSERT, UPDATE, DELETE)
          if (data.event && data.table && onTableChange) {
            onTableChange(data.event, data.table, data.record);
          }
        } catch (err) {
          console.warn('[SCSI Realtime] Erro ao decodificar mensagem WS:', err);
        }
      };

      ws.onclose = (event) => {
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        console.warn(`[SCSI Realtime] Conexão encerrada (código: ${event.code}). Agendando reconexão...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 1.5, 15000);
          connect();
        }, reconnectDelayRef.current);
      };

      ws.onerror = (err) => {
        console.info('[SCSI Realtime] WebSocket offline (modo local sem live updates).', err?.message);
        ws.close();
      };
    } catch (e) {
      console.info('[SCSI Realtime] Falha ao iniciar WebSocket:', e?.message);
    }
  }, [topic, onMessage, onTableChange]);

  useEffect(() => {
    connect();

    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [connect]);

  const send = useCallback((payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { send };
}

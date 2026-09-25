import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Square, 
  RefreshCw, 
  X, 
  ShieldAlert, 
  FileText, 
  UserCheck 
} from 'lucide-react';
import { useAIStream } from '../lib/useAIStream';

export default function AssistenteClinicoModal({ isOpen, onClose, prontuarioId = null, nomeAcolhido = '' }) {
  const [pergunta, setPergunta] = useState('');
  const { isStreaming, streamedText, error, iniciarStream, cancelarStream, limpar } = useAIStream();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pergunta.trim() || isStreaming) return;

    if (prontuarioId) {
      // Stream RAG sobre o prontuário específico
      iniciarStream(`/ia/prontuario/${prontuarioId}/stream/`, { pergunta });
    } else {
      // Stream de chat geral institucional
      iniciarStream('/ia/chat/stream/', { prompt: pergunta });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Bot className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg tracking-wide">Assistente Clínico Inteligente</h3>
                <span className="text-xs bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono">
                  SCSI Soberano
                </span>
              </div>
              <p className="text-xs text-blue-200">
                {nomeAcolhido ? (
                  <span className="flex items-center gap-1 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5" /> Analisando prontuário de: <strong>{nomeAcolhido}</strong>
                  </span>
                ) : (
                  'Consulta multidisciplinar e orientações institucionais'
                )}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
          {!streamedText && !error && (
            <div className="text-center py-10 px-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">Como posso ajudar a equipe hoje?</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                {prontuarioId 
                  ? 'Pergunte sobre laudos, anotações de evolução, medicamentos em uso ou histórico de reabilitação deste acolhido.'
                  : 'Tire dúvidas sobre protocolos de acolhimento, triagem, laborterapia e rotinas de assistência social.'}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800">
              <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong className="block font-medium">Falha na comunicação com a IA:</strong>
                {error}
              </div>
            </div>
          )}

          {isStreaming && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-amber-800 text-xs animate-pulse">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Atenção Clínica (CDSS):</strong> Conteúdo em geração assistiva por IA soberana. Validação clínica final pendente. Não adote condutas antes da conclusão e revisão técnica.
              </span>
            </div>
          )}

          {streamedText && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">

                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Parecer do Assistente Clínico</span>
                {isStreaming && (
                  <span className="flex items-center text-blue-600 font-normal normal-case">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping mr-1.5" />
                    Gerando resposta token a token...
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                {streamedText}
                {isStreaming && <span className="inline-block w-1.5 h-4 bg-blue-600 ml-1 animate-pulse align-middle" />}
              </div>
            </div>
          )}
        </div>

        {/* Footer & Input */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder={prontuarioId ? "Ex: Resuma a evolução clínica dos últimos 30 dias..." : "Digite sua dúvida ou procedimento..."}
              disabled={isStreaming}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60 transition"
            />
            
            {isStreaming ? (
              <button
                type="button"
                onClick={cancelarStream}
                className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 flex items-center gap-1.5 transition shadow-sm"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Parar</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!pergunta.trim()}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            )}

            {streamedText && !isStreaming && (
              <button
                type="button"
                onClick={limpar}
                title="Limpar conversa"
                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </form>
          <div className="mt-2 text-center">
            <span className="text-[11px] text-slate-400">
              Processado localmente via Llama 3.2 e pgvector. Nenhum dado de saúde sai da infraestrutura soberana.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

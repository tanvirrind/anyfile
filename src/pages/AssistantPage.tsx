import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Paperclip,
  Trash2,
  Copy,
  Check,
  FileCode,
  ShieldAlert,
  ArrowRight,
  Bot,
  User,
  RefreshCw,
  Info,
  ExternalLink,
  Wrench,
  FileSearch,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppRoute } from '../types';
import { ActionLink, extractSuggestedActions, generateLocalFallbackResponse } from '../lib/assistant/knowledgeEngine';
import { SEOHead } from '../components/SEOHead';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  fileInfo?: {
    name: string;
    size: number;
    mimeType: string;
    magicBytes?: string;
  };
  suggestedActions?: ActionLink[];
  isFallback?: boolean;
}

interface AssistantPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `### Hello! I am your AI File Format & Security Assistant.
Ask me any question about file extensions, opening software, file converters, repair instructions, or security risks.

**Popular questions to try:**
- *"What opens DWG files?"*
- *"How do I convert HEIC to JPG?"*
- *"Is this file safe to open?"*
- *"What is a PSD file?"*
- *"How do I repair a corrupted ZIP archive?"*

You can also **attach any file** using the button below to analyze its binary structure and verify its safety!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        {
          type: 'extension',
          label: 'DWG',
          badgeText: '.DWG File Info',
          route: { view: 'extension-detail', ext: 'dwg' },
          description: 'AutoCAD Drawing File',
        },
        {
          type: 'converter',
          label: 'HEIC to JPG',
          badgeText: 'Launch HEIC → JPG Converter',
          route: { view: 'converter-detail', id: 'heic-to-jpg' },
          description: 'Convert HEIC images in browser',
        },
        {
          type: 'tool',
          label: 'File Identifier',
          badgeText: 'Run File Identifier',
          route: { view: 'file-identifier' },
          description: 'Analyze raw file magic bytes',
        },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    file: File;
    magicBytesHex: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const presetQuestions = [
    { text: 'What opens DWG files?', icon: '📐' },
    { text: 'How do I convert HEIC to JPG?', icon: '🖼️' },
    { text: 'Is this file safe to open?', icon: '🛡️' },
    { text: 'What is a PSD file?', icon: '🎨' },
    { text: 'How do I repair a corrupted ZIP file?', icon: '🔧' },
    { text: 'How do I strip GPS metadata from photos?', icon: '🔍' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (buffer) {
        const uint8 = new Uint8Array(buffer.slice(0, 16));
        const hex = Array.from(uint8)
          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');
        setAttachedFile({ file, magicBytesHex: hex });
      } else {
        setAttachedFile({ file, magicBytesHex: 'N/A' });
      }
    };
    reader.readAsArrayBuffer(file.slice(0, 16));
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputQuery.trim();
    if (!promptToSend && !attachedFile) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let fileContextData: Message['fileInfo'] | undefined = undefined;
    if (attachedFile) {
      fileContextData = {
        name: attachedFile.file.name,
        size: attachedFile.file.size,
        mimeType: attachedFile.file.type || 'unknown/binary',
        magicBytes: attachedFile.magicBytesHex,
      };
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptToSend || `Please analyze this attached file: ${attachedFile?.file.name}`,
      timestamp,
      fileInfo: fileContextData,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    const currentAttached = attachedFile;
    setAttachedFile(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          fileContext: currentAttached
            ? {
                name: currentAttached.file.name,
                size: currentAttached.file.size,
                mimeType: currentAttached.file.type,
                magicBytes: currentAttached.magicBytesHex,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'No response returned.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [],
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('API error, executing client-side fallback:', err);
      const fallback = generateLocalFallbackResponse(promptToSend);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: fallback.suggestedActions,
        isFallback: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `### Chat Cleared.
How can I assist you with digital file formats today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <SEOHead
        title="AI File Format & Extension Assistant"
        description="Interactive AI Assistant to help you discover compatible software, convert uncommon file extensions, repair corrupt files, and audit security risks."
        canonicalPath="/assistant"
      />
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-6 lg:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  AnyFileX AI Assistant
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI expert for file formats, software recommendations, converters, repair guides & safety checks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8 min-h-0">
        {/* Left Column: Chat Stream */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden h-[680px] sm:h-[720px]">
          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* AI Avatar */}
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Body */}
                <div className={`max-w-[88%] sm:max-w-[80%] space-y-2`}>
                  {/* File Attachment card if user uploaded */}
                  {msg.fileInfo && (
                    <div className="p-3 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-200">
                        <span className="flex items-center gap-1.5 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                          <span className="truncate">{msg.fileInfo.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                          {(msg.fileInfo.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5 font-mono">
                        <span>MIME: {msg.fileInfo.mimeType}</span>
                        {msg.fileInfo.magicBytes && <span>Header: {msg.fileInfo.magicBytes}</span>}
                      </div>
                    </div>
                  )}

                  {/* Main Bubble */}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-tr-xs shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="prose dark:prose-invert max-w-none text-sm space-y-2">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Suggested Actions Badges */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-2">
                      <span className="w-full text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Quick Action Links:</span>
                      </span>
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => onNavigate(action.route)}
                          className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
                        >
                          <span>{action.badgeText}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message Meta */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 sm:gap-4 justify-start">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-tl-xs flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 font-medium">Analyzing database & generating response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Bar */}
          <div className="p-3 sm:p-4 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {/* Attached file chip preview */}
            {attachedFile && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Paperclip className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-blue-900 dark:text-blue-100 truncate">
                    {attachedFile.file.name}
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                    ({attachedFile.magicBytesHex})
                  </span>
                </div>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                id="assistant-file-upload-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Attach file for analysis"
                id="assistant-attach-btn"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything about DWG, HEIC, PSD, file safety, repair..."
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
                id="assistant-chat-input"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isLoading || (!inputQuery.trim() && !attachedFile)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
                id="assistant-send-btn"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Preset Questions & Tools Jump */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          {/* Quick Questions Box */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Suggested Questions</span>
            </h2>
            <div className="space-y-2">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50/60 dark:bg-slate-800/40 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <span className="text-base leading-none">{q.icon}</span>
                  <span className="flex-1 line-clamp-2">{q.text}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Direct Tool Shortcuts */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-indigo-600" />
              <span>Related AnyFileX Tools</span>
            </h2>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigate({ view: 'file-identifier' })}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                    File Identifier
                  </div>
                  <div className="text-[11px] text-slate-500">Detect unknown binary signatures</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => onNavigate({ view: 'converters' })}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                    In-Browser File Converters
                  </div>
                  <div className="text-[11px] text-slate-500">Convert HEIC, PNG, WEBP, PDF</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => onNavigate({ view: 'repair' })}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                    File Repair Hub
                  </div>
                  <div className="text-[11px] text-slate-500">Fix corrupted ZIP, PDF, JPEG files</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Trash2, Clock, Search, ArrowRight, BookOpen, FileText, Calendar, Sparkles } from 'lucide-react';
import { SearchHistoryItem } from '../types/shabdarth';

interface SearchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onSelectHistoryItem: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onClearOlderThan3Days: () => void;
  onDeleteItem: (id: string) => void;
}

export const SearchHistoryModal: React.FC<SearchHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onClearOlderThan3Days,
  onDeleteItem,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  // Filter out any single letters if any lingered
  const validHistory = history.filter((item) => item.query && item.query.trim().length >= 2);

  const filteredHistory = validHistory.filter((item) =>
    item.query.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.normalized.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.simpleHindi.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const olderThan3DaysCount = history.filter((item) => item.timestamp < threeDaysAgo).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>खोज इतिहास (Search History)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold">
                  {validHistory.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>3 दिन बाद पुराना इतिहास स्वतः हट जाता है</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Quick Cleanup */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="इतिहास में खोजें..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Button to Delete > 3 Days Old */}
          <button
            onClick={onClearOlderThan3Days}
            className="text-xs px-2.5 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200/60 dark:border-amber-800/60 font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            title="3 दिन से पुराना इतिहास साफ करें"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3 दिन पुराना हटाएं {olderThan3DaysCount > 0 ? `(${olderThan3DaysCount})` : ''}</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-40 stroke-1" />
              <p className="text-sm font-medium">कोई इतिहास उपलब्ध नहीं है</p>
              <p className="text-xs mt-1 text-slate-400">
                एकल अक्षर स्वतः छोड़ दिए जाते हैं। केवल पूर्ण शब्द और वाक्य यहाँ सुरक्षित होते हैं।
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500/60 bg-white dark:bg-slate-800/70 hover:shadow-sm transition-all flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                        item.isSentence
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                      }`}
                    >
                      {item.isSentence ? (
                        <>
                          <FileText className="w-2.5 h-2.5" /> वाक्य
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-2.5 h-2.5" /> शब्द
                        </>
                      )}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {item.query}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">सरल अर्थ: </span>
                    {item.simpleHindi}
                  </p>
                </div>

                <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-1 text-blue-600 dark:text-blue-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {validHistory.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              कुल {validHistory.length} रिकॉर्ड (3 दिन बाद स्वतः साफ)
            </span>
            <button
              onClick={onClearHistory}
              className="text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              सारा इतिहास साफ करें (Clear All)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

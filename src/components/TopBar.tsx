import { Menu, Moon, Plus, Search, Sun } from 'lucide-react';
import type { Category, WorkspaceView } from '../types/task';
import { VIEW_META } from '../utils/taskTokens';

interface TopBarProps {
  activeView: WorkspaceView;
  selectedCategory: Category | 'all';
  visibleCount: number;
  darkMode: boolean;
  onOpenMobileMenu: () => void;
  onClearCategory: () => void;
  onOpenCommandPalette: () => void;
  onToggleDarkMode: () => void;
  onOpenQuickAdd: () => void;
}

export function TopBar({
  activeView,
  selectedCategory,
  visibleCount,
  darkMode,
  onOpenMobileMenu,
  onClearCategory,
  onOpenCommandPalette,
  onToggleDarkMode,
  onOpenQuickAdd,
}: TopBarProps) {
  const meta = VIEW_META[activeView];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white px-4 sm:px-6 dark:border-[#1E293B] dark:bg-[#111827]">
      {/* Left: Mobile drawer button + View title & context */}
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E7EB] text-slate-600 hover:bg-[#F3F4F6] md:hidden dark:border-[#334155] dark:text-slate-300 dark:hover:bg-[#1E293B]"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 items-baseline gap-2">
          <h1 className="whitespace-nowrap text-[17px] font-semibold tracking-[-0.015em] text-[#0F172A] sm:text-[18px] dark:text-white">
            {meta.title}
          </h1>
          <span className="hidden whitespace-nowrap text-[12px] font-medium text-[#64748B] tabular-nums sm:inline dark:text-slate-400">
            {visibleCount} {visibleCount === 1 ? 'task' : 'tasks'}
          </span>
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={onClearCategory}
              aria-label={`Remove ${selectedCategory} category filter`}
              className="hidden items-center gap-1 rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[11px] font-semibold text-[#006c49] hover:bg-[#10B981]/20 sm:inline-flex dark:text-[#4edea3]"
            >
              <span>{selectedCategory}</span>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Command Search trigger + Theme toggle + Primary CTA */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Open command palette and search"
          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 text-[13px] font-medium text-[#64748B] transition-colors hover:border-[#D1D5DB] hover:bg-[#F3F4F6] hover:text-[#0F172A] whitespace-nowrap shrink-0 sm:px-3 dark:border-[#334155] dark:bg-[#090D16] dark:text-slate-400 dark:hover:bg-[#1E293B] dark:hover:text-white"
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden rounded border border-[#E5E7EB] bg-white px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#64748B] sm:inline dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-300">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white text-[#64748B] transition-colors hover:bg-[#F3F4F6] hover:text-[#0F172A] md:hidden dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-300"
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={onOpenQuickAdd}
          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-[#10B981] px-3 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-[#059669] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50 whitespace-nowrap shrink-0 sm:px-3.5"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}

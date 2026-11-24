import {
  CalendarClock,
  CheckCircle2,
  Command,
  Inbox,
  Kanban,
  Layers,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  SunMedium,
  X,
} from 'lucide-react';
import type { Category, WorkspaceView } from '../types/task';
import { CATEGORIES } from '../utils/taskLogic';
import { CATEGORY_STYLES } from '../utils/taskTokens';

interface SidebarProps {
  activeView: WorkspaceView;
  selectedCategory: Category | 'all';
  viewCounts: Record<WorkspaceView, number>;
  categoryCounts: Record<Category, number>;
  collapsed: boolean;
  mobileOpen: boolean;
  darkMode: boolean;
  onSelectView: (view: WorkspaceView) => void;
  onSelectCategory: (category: Category | 'all') => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onOpenCommandPalette: () => void;
  onToggleDarkMode: () => void;
}

const NAV_ITEMS: { id: WorkspaceView; label: string; icon: typeof SunMedium }[] = [
  { id: 'today', label: 'Today', icon: SunMedium },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarClock },
  { id: 'board', label: 'Board', icon: Kanban },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export function Sidebar({
  activeView,
  selectedCategory,
  viewCounts,
  categoryCounts,
  collapsed,
  mobileOpen,
  darkMode,
  onSelectView,
  onSelectCategory,
  onToggleCollapse,
  onCloseMobile,
  onOpenCommandPalette,
  onToggleDarkMode,
}: SidebarProps) {
  const sidebarBody = (isMobile: boolean) => {
    const isRail = !isMobile && collapsed;

    return (
      <div className="flex h-full flex-col justify-between bg-[#F3F4F6] text-[#0b1c30] dark:bg-[#090D16] dark:text-[#eaf1ff]">
        <div>
          {/* Workspace Brand Header */}
          <div
            className={`flex h-14 items-center border-b border-[#E5E7EB] dark:border-[#1E293B] ${
              isRail ? 'justify-center px-2' : 'justify-between px-4'
            }`}
          >
            {!isRail && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#10B981] text-white">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#0F172A] dark:text-white">
                  TaskFlow
                </span>
              </div>
            )}

            {isMobile ? (
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="rounded-[8px] p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1E293B] dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={isRail ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isRail ? 'Expand sidebar' : 'Collapse sidebar'}
                className="rounded-[8px] p-1.5 text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1E293B] dark:hover:text-white"
              >
                {isRail ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Primary Navigation */}
          <nav aria-label="Primary workspace views" className="space-y-0.5 px-2.5 py-3">
            {!isRail && (
              <div className="px-2 pb-1.5 text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400">
                Workspace
              </div>
            )}
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const count = viewCounts[item.id];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectView(item.id);
                    if (isMobile) onCloseMobile();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  title={isRail ? `${item.label} (${count})` : undefined}
                  className={`flex w-full items-center rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-colors duration-150 ${
                    isRail ? 'justify-center' : 'justify-between'
                  } ${
                    isActive
                      ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] ring-1 ring-[#E5E7EB] dark:bg-[#1E293B] dark:text-white dark:ring-[#334155]'
                      : 'text-[#565e74] hover:bg-white/60 hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-[#111827] dark:hover:text-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-[#10B981]'
                          : 'text-[#64748B] dark:text-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                    {!isRail && <span className="truncate">{item.label}</span>}
                  </span>
                  {!isRail && (
                    <span
                      className={`ml-2 text-[12px] font-medium tabular-nums ${
                        isActive
                          ? 'text-[#006c49] dark:text-[#4edea3]'
                          : 'text-[#64748B] dark:text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Categories Filter Section */}
          {!isRail && (
            <div className="border-t border-[#E5E7EB] px-2.5 py-3 dark:border-[#1E293B]">
              <div className="flex items-center justify-between px-2 pb-1.5">
                <span className="text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400">
                  Categories
                </span>
                {selectedCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => onSelectCategory('all')}
                    className="text-[11px] font-medium text-[#006c49] hover:underline dark:text-[#4edea3]"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-0.5">
                {CATEGORIES.map((category) => {
                  const style = CATEGORY_STYLES[category];
                  const isActive = selectedCategory === category;
                  const count = categoryCounts[category];
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        onSelectCategory(isActive ? 'all' : category);
                        if (isMobile) onCloseMobile();
                      }}
                      aria-pressed={isActive}
                      className={`flex w-full items-center justify-between rounded-[8px] px-2.5 py-1.5 text-[13px] transition-colors duration-150 ${
                        isActive
                          ? 'bg-white font-medium text-[#0F172A] ring-1 ring-[#E5E7EB] dark:bg-[#1E293B] dark:text-white dark:ring-[#334155]'
                          : 'text-[#565e74] hover:bg-white/60 hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-[#111827] dark:hover:text-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{category}</span>
                      </span>
                      <span className="text-[12px] text-[#64748B] tabular-nums dark:text-slate-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Utility Actions */}
        <div className="space-y-1 border-t border-[#E5E7EB] p-2.5 dark:border-[#1E293B]">
          <button
            type="button"
            onClick={() => {
              onOpenCommandPalette();
              if (isMobile) onCloseMobile();
            }}
            title="Open Command Palette (Cmd+K)"
            className={`flex w-full items-center rounded-[8px] px-2.5 py-2 text-[13px] font-medium text-[#565e74] transition-colors hover:bg-white/70 hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-[#111827] dark:hover:text-slate-100 ${
              isRail ? 'justify-center' : 'justify-between'
            }`}
          >
            <span className="flex items-center gap-2">
              <Command className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!isRail && <span>Command Palette</span>}
            </span>
            {!isRail && (
              <kbd className="rounded border border-[#E5E7EB] bg-white px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#64748B] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-300">
                ⌘K
              </kbd>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
            className={`flex w-full items-center rounded-[8px] px-2.5 py-2 text-[13px] font-medium text-[#565e74] transition-colors hover:bg-white/70 hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-[#111827] dark:hover:text-slate-100 ${
              isRail ? 'justify-center' : 'justify-between'
            }`}
          >
            <span className="flex items-center gap-2">
              {darkMode ? (
                <Sun className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              {!isRail && <span>{darkMode ? 'Light Appearance' : 'Dark Appearance'}</span>}
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop collapsible sidebar */}
      <aside
        aria-label="Workspace sidebar"
        className={`hidden shrink-0 border-r border-[#E5E7EB] transition-[width] duration-150 md:block dark:border-[#1E293B] ${
          collapsed ? 'w-[64px]' : 'w-[240px]'
        }`}
      >
        {sidebarBody(false)}
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <button
            type="button"
            aria-label="Close navigation backdrop"
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px]"
          />
          <aside
            aria-label="Mobile workspace navigation"
            className="relative z-50 h-full w-[260px] border-r border-[#E5E7EB] shadow-xl dark:border-[#1E293B]"
          >
            {sidebarBody(true)}
          </aside>
        </div>
      )}
    </>
  );
}

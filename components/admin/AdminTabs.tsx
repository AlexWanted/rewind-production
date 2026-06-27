'use client';

type TabType = 'videos' | 'snippets' | 'lives' | 'photos' | 'files';

interface AdminTabsProps {
  activeTab: TabType | string;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'videos', label: 'Videos' },
  { id: 'snippets', label: 'Snippets' },
  { id: 'lives', label: 'Lives' },
  { id: 'photos', label: 'Photos' },
  { id: 'files', label: 'Files' },
];

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto">
      {tabs.map(tab => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === tab.id
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
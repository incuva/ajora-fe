import React from 'react'
import ListFilterBadge from '@/components/shared/list-filter-badge'

export type TabKey = 'revenue' | 'performance' | 'growth'

interface ReportsTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const ReportsTabs = ({ activeTab, onTabChange }: ReportsTabsProps) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'performance', label: 'Pool Performance' },
    { key: 'growth', label: 'User Growth' }
  ]

  return (
    <div className="flex items-center gap-2 mb-6">
      {tabs.map((tab) => (
        <ListFilterBadge
          key={tab.key}
          active={activeTab === tab.key}
          label={tab.label}
          onClick={() => onTabChange(tab.key)}
        />
      ))}
    </div>
  )
}

export default ReportsTabs

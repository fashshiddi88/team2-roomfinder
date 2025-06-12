'use client';

interface PropertyTypeTabsProps {
  propertyTypes: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export default function PropertyTypeTabs({
  propertyTypes,
  selectedTab,
  onTabChange,
}: PropertyTypeTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {propertyTypes.map((type) => (
        <button
          key={type}
          onClick={() => onTabChange(type)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTab === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

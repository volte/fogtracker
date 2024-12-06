import React, { createContext } from 'react';
import ImportTrackerView from '@/components/ImportTrackerView';
import TrackerListView from '@/components/TrackerListView';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/trackerDb';
import styled from 'styled-components';
import { Tab, Tabs } from '@/components/ui/Tabs';

const AppRoot = styled.div`
  height: 100vh;
`;

const AppTabs = () => {
  const [selectedTab, setSelectedTab] = React.useState(1);
  const areaCount = useLiveQuery(() => db.areas.count(), [], 0);
  const isInitialized = areaCount > 0;

  const onImportComplete = () => {
    setSelectedTab(1);
  };

  const tabs: Tab[] = [
    {
      title: 'Import',
      content: <ImportTrackerView onImportComplete={onImportComplete} />,
    },
    ...(isInitialized
      ? [
          {
            title: 'List',
            content: <TrackerListView />,
          },
        ]
      : []),
  ];

  return <Tabs activeIndex={selectedTab} onActiveIndexChange={setSelectedTab} tabs={tabs} />;
};

/**
 * Root app component.
 */
const App = () => {
  return (
    <AppRoot>
      <AppTabs />
    </AppRoot>
  );
};

export default App;

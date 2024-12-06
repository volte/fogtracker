import { grommet, Grommet, Tab, Tabs } from 'grommet';
import React, { createContext } from 'react';
import { Tracker } from '@/core/tracker';
import ImportTrackerView from '@/components/ImportTrackerView';
import TrackerListView from '@/components/TrackerListView';
import { useObservableState } from '@/hooks/useObservableState';

const tracker = new Tracker();
export const TrackerContext = createContext<Tracker>(tracker);

const storedTrackerState = localStorage.getItem('trackerState');
if (storedTrackerState) {
  tracker.setState(JSON.parse(storedTrackerState));
}

tracker.trackerState$.subscribe(trackerState => {
  if (trackerState.isInitialized) {
    console.log('Saving tracker state to local storage');
    localStorage.setItem('trackerState', JSON.stringify(trackerState));
  }
});

const AppTabs = () => {
  const trackerState = useObservableState(tracker.trackerState$);
  const [selectedTab, setSelectedTab] = React.useState(1);

  const onImportComplete = () => {
    setSelectedTab(1);
  };

  return (
    <Tabs activeIndex={selectedTab} onActive={setSelectedTab}>
      <Tab title="Import">
        <ImportTrackerView onImportComplete={onImportComplete} />
      </Tab>
      {trackerState.value?.isInitialized && (
        <>
          <Tab title="List">
            <TrackerListView />
          </Tab>
        </>
      )}
    </Tabs>
  );
};

/**
 * Root app component.
 */
const App = () => {
  return (
    <Grommet full theme={grommet} themeMode="dark">
      <TrackerContext.Provider value={tracker}>
        <AppTabs />
      </TrackerContext.Provider>
    </Grommet>
  );
};

export default App;

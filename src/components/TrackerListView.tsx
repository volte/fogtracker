import React, { useContext } from 'react';
import { TrackerContext } from '@/components/App';
import { useObservableState } from '@/hooks/useObservableState';
import { Box, CheckBox, Header, Page } from 'grommet';
import { TrackerArea, TrackerState } from '@/core/tracker';

export interface Props {}

const TrackerListView = (props: Props) => {
  const tracker = useContext(TrackerContext);
  const trackerState = useObservableState(tracker.trackerState$);

  if (!trackerState.value) {
    return null;
  }

  const renderAreaPorts = (area: TrackerArea) => {
    const ports = trackerState.value!.ports.filter(a => a.areaId === area.id);
    return ports.map(port => {
      const isPortRevealed = trackerState.value!.connections.some(
        c => c.type === 'port' && (c.toPortId === port.id || c.fromPortId === port.id) && c.isRevealed
      );
      const toggleRevealed = () => {
        tracker.revealPort(port.id, !isPortRevealed);
      };
      return (
        <Box key={port.id}>
          <CheckBox label={port.name} checked={isPortRevealed} onChange={toggleRevealed} />
        </Box>
      );
    });
  };

  return (
    <Page kind="narrow">
      {trackerState.value.areas.map(area => (
        <Box key={area.id}>
          <Header>{area.name}</Header>
          {renderAreaPorts(area)}
        </Box>
      ))}
    </Page>
  );
};

export default TrackerListView;

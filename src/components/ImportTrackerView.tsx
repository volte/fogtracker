import React, { useContext, useEffect } from 'react';
import { Page, PageContent, PageHeader, Select } from 'grommet';
import DarkSoulsImporter from '@/components/game/DarkSoulsImporter';
import { TrackerState } from '@/core/tracker';
import { TrackerContext } from '@/components/App';

export interface Props {
  onImportComplete: () => void;
}

export type SupportedGameImporterProps = {
  onImportTrackerState: (trackerState: TrackerState) => void;
};

interface SupportedGame {
  id: string;
  name: string;
  importer: React.ComponentType<SupportedGameImporterProps>;
}

const supportedGames: SupportedGame[] = [
  {
    id: 'darkSouls',
    name: 'Dark Souls',
    importer: DarkSoulsImporter,
  },
];

const ImportTrackerView = (props: Props) => {
  const [selectedGame, setSelectedGame] = React.useState(supportedGames[0]!.id);
  const importer = supportedGames.find(game => game.id === selectedGame)?.importer;
  const tracker = useContext(TrackerContext);

  const onImportTrackerState = (trackerState: TrackerState) => {
    if (tracker) {
      tracker.setState(trackerState);
      props.onImportComplete();
    }
  };

  return (
    <Page kind="narrow">
      <PageContent>
        <PageHeader title="Import Tracker Data" />
        <Select
          options={supportedGames}
          labelKey="name"
          valueKey="id"
          value={selectedGame}
          onChange={({ option }) => setSelectedGame(option.id)}
        />
        {importer &&
          React.createElement<SupportedGameImporterProps>(importer, {
            onImportTrackerState,
          })}
      </PageContent>
    </Page>
  );
};

export default ImportTrackerView;

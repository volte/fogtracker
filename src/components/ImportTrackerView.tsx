import React from 'react';
import DarkSoulsImporter from '@/components/game/DarkSoulsImporter';
import { TrackerState } from '@/core/game/trackerState';
import { db } from '@/core/db/trackerDb';
import { Margin } from '@/components/styles/Spacing';
import { FlexColumn } from '@/components/styles/FlexBox';
import Select from 'react-select';

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

  const onImportTrackerState = async (trackerState: TrackerState) => {
    await db.initFromState(trackerState);
    props.onImportComplete();
  };

  return (
    <FlexColumn gap={Margin.Medium}>
      <h1 title="Import TrackerState Data" />
      <Select<SupportedGame>
        options={supportedGames}
        formatOptionLabel={option => option.name}
        value={supportedGames.find(game => game.id === selectedGame)}
        onChange={option => setSelectedGame(option?.id || supportedGames[0]!.id)}
      />
      {importer &&
        React.createElement<SupportedGameImporterProps>(importer, {
          onImportTrackerState,
        })}
    </FlexColumn>
  );
};

export default ImportTrackerView;

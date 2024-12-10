import React, { useState } from 'react';
import DarkSoulsImporter from '@/components/game/DarkSoulsImporter';
import { TrackerState } from '@/core/game/trackerState';
import { db } from '@/core/db/trackerDb';
import { Margin } from '@/components/styles/Spacing';
import { FlexColumn } from '@/components/styles/FlexBox';
import Select from 'react-select';
import FileUploader from '@/components/util/FileUploader';
import { Button } from '@/components/styles/Button';

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
  const [uploadedData, setUploadedData] = useState<string | null>(null);
  const importer = supportedGames.find(game => game.id === selectedGame)?.importer;

  const onImportTrackerState = async (trackerState: TrackerState) => {
    await db.initFromState(trackerState);
    props.onImportComplete();
  };

  const onImportJsonClick = async () => {
    if (!uploadedData) {
      return;
    }

    try {
      await db.importFromJson(uploadedData);
      props.onImportComplete();
    } catch (err) {
      console.error(`Error importing JSON: ${err}`);
    }
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
      <hr />
      <h2>Import From Exported JSON</h2>
      <FileUploader onUploadedDataChange={setUploadedData} />
      <Button disabled={!uploadedData} onClick={onImportJsonClick}>
        Import
      </Button>
    </FlexColumn>
  );
};

export default ImportTrackerView;

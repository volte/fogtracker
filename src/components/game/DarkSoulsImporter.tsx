import React, { useState } from 'react';
import FileUploader from '@/components/util/FileUploader';

import gameDataUrl from '@assets/data/ds1/gameData.yml';
import { useEffectAsync } from '@/hooks/useEffectAsync';
import { darkSoulsGameDefinition } from '@/core/game/ds1/darkSouls';
import { TrackerState } from '@/core/game/trackerState';
import Alert, { AlertType } from '@/components/ui/Alert';
import { FlexColumn, FlexRow } from '@/components/styles/FlexBox';
import styled from 'styled-components';

export interface Props {
  onImportTrackerState: (trackerState: TrackerState) => void;
}

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const DarkSoulsImporter = (props: Props) => {
  const [uploadedData, setUploadedData] = useState<string | null>(null);
  const [trackerState, setTrackerState] = useState<TrackerState | null>(null);
  const [gameData, setGameData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffectAsync(async () => {
    try {
      const gameDataRes = await fetch(gameDataUrl);
      const gameData = await gameDataRes.text();
      setGameData(gameData);
      setError(null);
    } catch (err) {
      console.error(`Error fetching game data: ${err}`);
    }
  }, []);

  useEffectAsync(async () => {
    if (gameData && uploadedData) {
      // Parse the uploaded data and set it to the tracker data state
      try {
        const initialTrackerState = await darkSoulsGameDefinition.initializeTrackerState({
          gameData,
          cheatSheetData: uploadedData,
        });
        setTrackerState(initialTrackerState);
        setError(null);
      } catch (err) {
        setError(`Error parsing uploaded data: ${err}`);
      }
    } else {
      setUploadedData(null);
      setTrackerState(null);
    }
  }, [gameData, uploadedData]);

  const onImportClick = () => {
    if (trackerState) {
      props.onImportTrackerState(trackerState);
    }
  };

  return (
    <>
      <FlexColumn>
        <FileUploader onUploadedDataChange={setUploadedData} />
        <Button disabled={!uploadedData} onClick={onImportClick}>
          Import
        </Button>

        {error && <Alert type={AlertType.Error} content={error} />}
        {trackerState && <Alert type={AlertType.Success} content="This is a valid cheat sheet!" />}
      </FlexColumn>
    </>
  );
};

export default DarkSoulsImporter;

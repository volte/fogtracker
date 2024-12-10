import React from 'react';

import { TrackerState } from '@/core/game/trackerState';
import { db } from '@/core/db/trackerDb';
import { Margin } from '@/components/styles/Spacing';
import { FlexColumn } from '@/components/styles/FlexBox';
import Select from 'react-select';

const ExportTrackerView = () => {
  const [exportedData, setExportedData] = React.useState<string | null>(null);

  const handleExport = async () => {
    // TODO: Replace with actual export function
    const data = await db.exportToJson();

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tracker-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <FlexColumn style={{ padding: Margin.Medium }}>
      <button 
        onClick={handleExport}
        style={{
          padding: '8px 16px',
          fontSize: '1.1em',
          cursor: 'pointer'
        }}
      >
        Export Tracker Data
      </button>

      {exportedData && (
        <pre style={{ marginTop: Margin.Medium }}>
          {exportedData}
        </pre>
      )}
    </FlexColumn>
  );
};

export default ExportTrackerView;

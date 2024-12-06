import React from 'react';
import { Box, FileInput } from 'grommet';

export interface Props {
  onUploadedDataChange: (data: string) => void;
}

const FileUploader = (props: Props) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        props.onUploadedDataChange(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box pad="medium">
      <FileInput name="file" onChange={handleFileChange} />
    </Box>
  );
};

export default FileUploader;

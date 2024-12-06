import React from 'react';
import { FileUploader as ReactFileUploader } from 'react-drag-drop-files';

export interface Props {
  onUploadedDataChange: (data: string) => void;
}

const FileUploader = (props: Props) => {
  const handleFileChange = (file: File) => {
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
    <div>
      <ReactFileUploader name="file" handleChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;

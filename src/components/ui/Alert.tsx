import styled from 'styled-components';
import { Box, Text } from 'grommet';
import {
  Checkmark,
  CircleAlert,
  CircleInformation,
  DocumentExcel,
  StatusCritical,
  StatusGood,
  StatusInfo,
  StatusWarning,
  X,
} from 'grommet-icons';
import React from 'react';
import { FlexRow } from '@/components/styles/FlexBox';

export enum AlertType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export interface Props {
  type: AlertType;
  content: React.ReactNode;
}

const AlertIcon = (props: { type: AlertType }) => {
  switch (props.type) {
    case AlertType.Info:
      return <StatusInfo />;
    case AlertType.Success:
      return <StatusGood />;
    case AlertType.Warning:
      return <StatusWarning />;
    case AlertType.Error:
      return <StatusCritical />;
    default:
      return <CircleInformation />;
  }
};

const Alert = (props: Props) => {
  return (
    <FlexRow gap="8px">
      <AlertIcon type={props.type} />
      <Text>{props.content}</Text>
    </FlexRow>
  );
};

export default Alert;

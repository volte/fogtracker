import styled from 'styled-components';

import React from 'react';
import { FlexRow } from '@/components/styles/FlexBox';
import { Margin } from '@/components/styles/Spacing';

export enum AlertType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

const AlertBox = styled.div<{ $alertType: AlertType }>`
  padding: ${Margin.Large};
  border-radius: 4px;
  border: 1px solid
    ${props => {
      switch (props.$alertType) {
        case AlertType.Info:
          return '#4e9add';
        case AlertType.Success:
          return '#26b44a';
        case AlertType.Warning:
          return '#e4c61b';
        case AlertType.Error:
          return '#cc3f34';
      }
    }};
`;

export interface Props {
  type: AlertType;
  content: React.ReactNode;
}

const Alert = (props: Props) => {
  return <AlertBox $alertType={props.type}>{props.content}</AlertBox>;
};

export default Alert;

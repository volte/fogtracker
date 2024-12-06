import styled from 'styled-components';

export const FlexBox = styled.div<{
  gap?: string;
}>`
  display: flex;
  ${props => props.gap && `gap: ${props.gap}`};
`;

export const FlexRow = styled(FlexBox)`
  flex-direction: row;
`;

export const FlexColumn = styled(FlexBox)`
  flex-direction: column;
`;

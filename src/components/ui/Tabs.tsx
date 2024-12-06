import React from 'react';
import { FlexColumn, FlexRow } from '@/components/styles/FlexBox';
import styled from 'styled-components';
import { Margin } from '@/components/styles/Spacing';

const TabBar = styled(FlexRow)`
  align-content: center;
  height: 64px;
  background-color: maroon;
  color: white;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
`;

const TabTitle = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  padding: ${Margin.Small};
  font-weight: ${props => (props.$isActive ? 'bold' : 'normal')};
`;

const TabPage = styled.div`
  padding: ${Margin.Small};
`;

export interface Props {
  tabs: Tab[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

export interface Tab {
  title: string;
  content: React.ReactNode;
}

export const Tabs = (props: Props) => {
  return (
    <FlexColumn gap={Margin.Small}>
      <TabBar gap={Margin.Small}>
        {props.tabs.map((tab, index) => (
          <TabTitle
            key={index}
            onClick={() => props.onActiveIndexChange(index)}
            $isActive={props.activeIndex === index}
          >
            {tab.title}
          </TabTitle>
        ))}
      </TabBar>
      {props.tabs[props.activeIndex]?.content || null}
    </FlexColumn>
  );
};

import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/trackerDb';
import { Area, Connection, Port } from '@/core/db/model';
import { FlexColumn, FlexRow } from '@/components/styles/FlexBox';
import styled from 'styled-components';
import { Margin } from '@/components/styles/Spacing';

export interface Props {}

const CheckBox = styled.input.attrs({ type: 'checkbox' })``;

const AreaHeaderRow = styled(FlexRow)`
  align-items: end;
  gap: 8px;
`;

const AreaHeader = styled.div`
  font-weight: bold;
  font-size: 1.2em;
`;

const AreaDescription = styled.div`
  font-style: italic;
  color: #444444;
`;

const PortLabel = styled.span`
  font-style: italic;
  padding-left: ${Margin.Medium};
`;

const OtherSideLabel = styled.span`
  font-style: italic;
  opacity: 0.75;
  padding-left: ${Margin.Medium};
  margin-left: 32px;
  color: #7070ff;
`;

const StyledAnchor = styled.a`
  text-decoration: none;
  color: white;
  &:hover {
    text-decoration: underline;
    color: #ebe218;
  }
`;

const SideBar = styled(FlexColumn)`
  background-color: #ffffff40;
  background-blend-mode: screen;
  padding: 8px;
  width: 200px;
  overflow: auto;
  position: sticky;
  top: ${Margin.Medium};
  max-height: calc(100vh - 128px);
  margin: ${Margin.Medium};
`;

const SidebarHeading = styled.h1`
  font-size: 1.2em;
  font-weight: bold;
`;

const Content = styled(FlexColumn)``;

const TrackerPortView = ({ port }: { port: Port }) => {
  const connections = useLiveQuery(
    () =>
      db.connections
        .where({ type: 'port' })
        .and(connection => connection.fromId === port.id || connection.toId === port.id)
        .toArray(),
    [port.id],
    [] as Connection[]
  );
  const otherPort = useLiveQuery(
    () =>
      db.ports
        .where('id')
        .anyOf(connections.map(c => (c.fromId === port.id ? c.toId : c.fromId)))
        .first(),
    [port.id, connections],
    undefined
  );
  const otherArea = useLiveQuery(
    () =>
      db.areas
        .where('id')
        .equals(otherPort?.areaId || '')
        .first(),
    [otherPort?.areaId]
  );
  const toggleRevealed = () => {
    db.transaction('rw', db.ports, async () => {
      await db.ports.bulkPut(
        [port, ...(otherPort ? [otherPort] : [])].map(p => ({
          ...p,
          isRevealed: !port.isRevealed,
        }))
      );
    });
  };
  if (!port || connections.length === 0) {
    return null;
  }
  return (
    <FlexColumn key={port.id}>
      <label>
        <StyledAnchor id={port.id} />
        <CheckBox checked={port.isRevealed} onChange={toggleRevealed} />
        <PortLabel>{port.name}</PortLabel>
      </label>
      {port.isRevealed && otherPort && (
        <FlexRow key={otherPort.id}>
          <StyledAnchor href={`#${otherPort.id}`}>
            <OtherSideLabel>
              {otherArea && otherArea.name} ({otherPort.name})
            </OtherSideLabel>
          </StyledAnchor>
        </FlexRow>
      )}
    </FlexColumn>
  );
};

const TrackerAreaView = ({ area }: { area: Area }) => {
  const ports = useLiveQuery(() => db.ports.where({ areaId: area.id }).toArray(), [area.id], []);
  const connections = useLiveQuery(
    () =>
      db.connections
        .where('fromId')
        .anyOf(ports.map(p => p.id))
        .toArray(),
    [ports],
    [] as Connection[]
  );

  if (ports.length === 0 || connections.length === 0) {
    return null;
  }

  return (
    <FlexColumn>
      <a id={area.id} />
      <AreaHeaderRow>
        <AreaHeader>{area.name}</AreaHeader>
        <AreaDescription>{area.description}</AreaDescription>
      </AreaHeaderRow>

      {ports.map(port => (
        <TrackerPortView port={port} key={port.id} />
      ))}
    </FlexColumn>
  );
};

const TrackerListView = () => {
  const areas = useLiveQuery(() => db.areas.toArray(), [], []);

  return (
    <FlexRow gap={Margin.Medium}>
      <SideBar>
        <SidebarHeading>Areas</SidebarHeading>
        {areas.map(area => (
          <StyledAnchor href={`#${area.id}`} key={area.id}>
            {area.name}
          </StyledAnchor>
        ))}
      </SideBar>
      <Content gap={Margin.Medium}>
        {areas.map(area => (
          <TrackerAreaView area={area} key={area.id} />
        ))}
      </Content>
    </FlexRow>
  );
};

export default TrackerListView;

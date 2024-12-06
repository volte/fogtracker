import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/trackerDb';
import { Area, Connection, Port } from '@/core/db/model';
import { FlexColumn, FlexRow } from '@/components/styles/FlexBox';
import styled from 'styled-components';
import { Margin } from '@/components/styles/Spacing';

export interface Props {}

const CheckBox = styled.input.attrs({ type: 'checkbox' })``;

const AreaHeader = styled.div`
  font-weight: bold;
  font-size: 1.2em;
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
  color: blue;
`;

const StyledAnchor = styled.a`
  text-decoration: none;
`;

const SideBar = styled(FlexColumn)`
  background-color: #f0f0f0;
  padding: 8px;
  width: 200px;
  overflow: auto;
  position: sticky;
  top: 8px;
  max-height: calc(100vh);
`;

const Content = styled(FlexColumn)`
  overflow: auto;
`;

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
      <AreaHeader>{area.name}</AreaHeader>
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
        <h1>Areas</h1>
        {areas.map(area => (
          <a href={`#${area.id}`}>{area.name}</a>
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

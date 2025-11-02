import React from 'react';

import { ConnectionProvider } from '../contexts/ConnectionContext';
import { CommandProvider } from '../contexts/CommandContext';
import { SensorProvider } from '../contexts/SensorContext';
import { DeviceProvider } from '../contexts/DeviceContext';

export default function AppProviders({ children }) {
  return (
    <ConnectionProvider>
      <CommandProvider>
        <SensorProvider>
          <DeviceProvider>
            {children}
          </DeviceProvider>
        </SensorProvider>
      </CommandProvider>
    </ConnectionProvider>
  );
}


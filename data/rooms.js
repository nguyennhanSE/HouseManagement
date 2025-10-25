// Mock room data for the smart home dashboard screen
export const mockRooms = [
  {
    id: 'living-room',
    name: 'Phòng khách',
    icon: '🛋️',
    devices: {
      light: { isOn: true, level: 75 },
      ac: { isOn: true, temperature: 22 },
    },
  },
  {
    id: 'bedroom',
    name: 'Phòng ngủ',
    icon: '🛏️',
    devices: {
      light: { isOn: false, level: 30 },
      ac: { isOn: false, temperature: 24 },
    },
  },
  {
    id: 'kitchen',
    name: 'Nhà bếp',
    icon: '🍴',
    devices: {
      light: { isOn: true, level: 90 },
      ac: { isOn: true, temperature: 23 },
    },
  },
  {
    id: 'bathroom',
    name: 'Phòng tắm',
    icon: '🛁',
    devices: {
      light: { isOn: true, level: 65 },
      fan: { isOn: true, speed: 'Medium' },
    },
  },
];



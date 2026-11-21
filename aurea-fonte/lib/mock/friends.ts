import type { Friend } from './types';
export const FRIENDS: Friend[] = [
  { id: 'ana', name: 'Ana Luiza', handle: '@analu', level: 'ouro', hue: 330, pixKey: 'ana@exemplo.com' },
  { id: 'pedro', name: 'Pedro Henrique', handle: '@pedroh', level: 'ouro', hue: 200, pixKey: '+55 11 9****-4410' },
  { id: 'joao', name: 'João Pedro', handle: '@jp', level: 'prata', hue: 150, pixKey: 'joao@exemplo.com' },
  { id: 'bia', name: 'Beatriz Rocha', handle: '@biarocha', level: 'diamante', hue: 270, pixKey: '***.211.640-**' },
  { id: 'lucas', name: 'Lucas Martins', handle: '@lucasm', level: 'bronze', hue: 20, pixKey: 'lucas@exemplo.com' },
  { id: 'carol', name: 'Carolina Dias', handle: '@carold', level: 'prata', hue: 0, pixKey: '+55 21 9****-7782' },
  { id: 'rafa', name: 'Rafael Souza', handle: '@rafas', level: 'ouro', hue: 100, pixKey: 'chave-aleatoria-7f3a' },
  { id: 'gabi', name: 'Gabriela Nunes', handle: '@gabin', level: 'bronze', hue: 50, pixKey: 'gabi@exemplo.com' },
];
export const friendById = (id: string) => FRIENDS.find((f) => f.id === id);

export type Radio = {
  name: string;
  url: string;
  duration?: number;
  img?: string;
  
};

export const radiosData: Radio[] = [
  {
    name: 'Blonded Radio',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GdKeuqCyWMFjTUrZw1OICfBVbPlK6q3vXgsm2',
    img: './logos/BlondedImg.svg'
  },
  {
    name: 'World Wide FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6G7tfOjrAo5FSbJjW1qlpHPngcTtIZesyQN3dC',
    img: './logos/WorldwideImg.webp'
  },
  {
    name: 'Non Stop Pop FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GUib1NuXOijmT1DYbsBgRLWqr5kNSF2V3pxo4',
    img: './logos/Non-StopImg.svg'
  },
  {
    name: 'FlyLo FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GGWq6U5NTurIYbOT76l0f92wBWZzAFh4UtqLQ',
    img: './logos/FlyLoImg.svg'
  },
  {
    name: 'The Lab',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GTLEdVuFPrBmIdEt0134i2k6fQXT7JLaFY9cC',
    // No specific logo file for "The Lab" in public/logos; reusing The_Blue_ArkImg.svg as a fallback
    img: './logos/The_Blue_ArkImg.svg'
  },
  {
    name: 'Soulwax FM',
    url:'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GIBybXA6fv5SjqZOCRAdYWkpz2Vaonl8BJEer',
    img: './logos/Soulwax_FMImg.svg'
  },
  {
    name: 'Vinewood Boulevard Radio',
    url:'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GaDk6xgY8NwBHd6vKx4RLSIcWfuk0pE7r1tsD',
    img: './logos/Vinewood_Boulevard_RadioImg.svg'
  },
  {
    name: 'Blue Ark',
    url:'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GPeFmwUz4xfGrguI7mQS2Kd1R6HvzBWJhLkj9',
    img: './logos/The_Blue_ArkImg.svg'
  },
  {
    name: 'Space 103.2',
    url:'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GXC4i5EcNMTgQVYd3xEGoWtaIuH9KCNpOfwj0',
    img: './logos/Space_103_2Img.svg'
  },
  {
    name: 'Radio Mirror Park',
    url:'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6Gri8o5hD3fJbijF5ce2zgZWn8kOrNYRmMwV9v',
    img: './logos/Radio_Mirror_ParkJmg.svg'
  },
  {
    name: 'The Lowdown 91.1',
    url:'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GCponaa4ehRQBSG74yAsMxFVbKaHZJEromwYn',
    img: './logos/The_Low_Img.svg'
  },
  {
    name: 'Los Santos Rock Radio',
    url:'',
    img: './logos/Radio_Los_SantosImg.svg'
  },
  {
    name: 'East Los FM',
    url:'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GxDIUfzOIrw2YBqWjL7ub3nOTsHk8UvRg51Xe',
    img: './logos/EastImg.svg'
  },
];

const isFiniteDuration = (duration: number): boolean => Number.isFinite(duration) && duration > 0;

const loadRadioDuration = (url: string): Promise<number | undefined> =>
  new Promise((resolve) => {
    if (typeof Audio === 'undefined') {
      resolve(undefined);
      return;
    }

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = url;

    const cleanup = (): void => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.src = '';
      audio.load();
    };

    const handleLoadedMetadata = (): void => {
      const duration = isFiniteDuration(audio.duration) ? audio.duration : undefined;
      cleanup();
      resolve(duration);
    };

    const handleError = (): void => {
      cleanup();
      resolve(undefined);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
    audio.addEventListener('error', handleError, { once: true });
    audio.load();
  });

export const hydrateRadioDurations = async (radios: Radio[]): Promise<Radio[]> => {
  const durations = await Promise.all(radios.map((radio) => loadRadioDuration(radio.url)));

  durations.forEach((duration, index) => {
    radios[index].duration = duration;
  });

  return radios;
};

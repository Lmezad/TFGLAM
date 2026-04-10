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
  },
  {
    name: 'World Wide FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6G7tfOjrAo5FSbJjW1qlpHPngcTtIZesyQN3dC',
  },
  {
    name: 'Non Stop Pop FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GUib1NuXOijmT1DYbsBgRLWqr5kNSF2V3pxo4',
  },
  {
    name: 'FlyLo FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GGWq6U5NTurIYbOT76l0f92wBWZzAFh4UtqLQ',
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

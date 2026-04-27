export type Radio = {
  name: string;
  url: string;
  duration?: number;
  img?: string;
  backimg?: string;
  backimgRadio?: string;
  genre?: string;
  producer?: string;
  year?: number;
  game?: string;
};

export const radiosData: Radio[] = [
  {
    name: 'Blonded Radio',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GdKeuqCyWMFjTUrZw1OICfBVbPlK6q3vXgsm2',
    img: './logos/BlondedImg.svg',
    backimg: './LogosBG/blonded.webp',
    backimgRadio: './BgImg/Blonded.jpg',
    genre: 'Alternative R&B / Experimental',
    producer: 'Frank Ocean',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'World Wide FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6G7tfOjrAo5FSbJjW1qlpHPngcTtIZesyQN3dC',
    img: './logos/WorldwideImg.webp',
    backimg: './LogosBG/worldwidefm.webp',
    backimgRadio: './BgImg/default.jpg',
    genre: 'Eclectic / Jazz / Global',
    producer: 'Gilles Peterson',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'Non Stop Pop FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GUib1NuXOijmT1DYbsBgRLWqr5kNSF2V3pxo4',
    img: './logos/Non-StopImg.svg',
    backimg: './LogosBG/nonstoppop.webp',
    backimgRadio: './BgImg/nonstopRadio.jpg',
    genre: 'Pop / Top 40',
    producer: 'Various',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'FlyLo FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GGWq6U5NTurIYbOT76l0f92wBWZzAFh4UtqLQ',
    img: './logos/FlyLoImg.svg',
    backimg: './LogosBG/flylo.webp',
    backimgRadio: './BgImg/flylow.jpg',
    genre: 'Experimental Electronic / Hip Hop',
    producer: 'Flying Lotus',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'The Lab',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GTLEdVuFPrBmIdEt0134i2k6fQXT7JLaFY9cC',
    // No specific logo file for "The Lab" in public/logos; reusing The_Blue_ArkImg.svg as a fallback
    img: './logos/The_Blue_ArkImg.svg',
    backimg: './LogosBG/theblueark.webp',
    backimgRadio: './BgImg/thelab.jpg',
    genre: 'Electronic / Experimental',
    producer: 'Various',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'Soulwax FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GIBybXA6fv5SjqZOCRAdYWkpz2Vaonl8BJEer',
    img: './logos/Soulwax_FMImg.svg',
    backimg: './LogosBG/soulwax.webp',
    backimgRadio: './BgImg/soulwaxfm.jpg',
    genre: 'Electronic / Dance',
    producer: 'Soulwax',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'Vinewood Boulevard Radio',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GaDk6xgY8NwBHd6vKx4RLSIcWfuk0pE7r1tsD',
    img: './logos/Vinewood_Boulevard_RadioImg.svg',
    backimg: './LogosBG/vinewoodboulevard.webp',
    // no specific BgImg available for Vinewood in public/BgImg -> use default fallback
    backimgRadio: './BgImg/default.jpg',
    genre: 'Rock / Classic Rock',
    producer: 'Various',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'Blue Ark',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GPeFmwUz4xfGrguI7mQS2Kd1R6HvzBWJhLkj9',
    img: './logos/The_Blue_ArkImg.svg',
    backimg: './LogosBG/theblueark.webp',
    backimgRadio: './BgImg/theblueark.jpg',
    genre: 'Reggae / Dub',
    producer: 'Various',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'Space 103.2',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GXC4i5EcNMTgQVYd3xEGoWtaIuH9KCNpOfwj0',
    img: './logos/Space_103_2Img.svg',
    backimg: './LogosBG/space.webp',
    // no specific BgImg for Space 103.2 -> use default fallback
    backimgRadio: './BgImg/default.jpg',
    genre: 'Soul / Funk / Disco',
    producer: 'Various',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'Radio Mirror Park',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6Gri8o5hD3fJbijF5ce2zgZWn8kOrNYRmMwV9v',
    img: './logos/Radio_Mirror_ParkJmg.svg',
    backimg: './LogosBG/radiomirrorpark.webp',
    backimgRadio: './BgImg/radiomirrorpark.jpg',
    genre: 'Indie / Alternative',
    producer: 'Various',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'The Lowdown 91.1',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GCponaa4ehRQBSG74yAsMxFVbKaHZJEromwYn',
    img: './logos/The_Low_Img.svg',
    backimg: './LogosBG/thelowdown.webp',
    backimgRadio: './BgImg/theLow.jpg',
    genre: 'Hip Hop / R&B',
    producer: 'Various',
    year: 2013,
    game: 'GTA V'
  },
  {
    name: 'San Juan Sounds',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GKi076olblSnZxc7CQP86O1KDfiHJ4F0qLwgs',
    img: './logos/Radio_Los_SantosImg.svg',
    backimg: './LogosBG/lossantos.webp',
    // no specific BgImg for Los Santos -> use default fallback
    backimgRadio: './BgImg/default.jpg',
    genre: 'Latin / Reggaeton',
    producer: 'Various',
    year: 2013,
    game: 'GTA IV'
  },
  {
    name: 'East Los FM',
    url: 'https://5fkef9udgm.ufs.sh/f/gkQPQrvJfr6GxDIUfzOIrw2YBqWjL7ub3nOTsHk8UvRg51Xe',
    img: './logos/EastImg.svg',
    backimg: './LogosBG/eastlos.webp',
    backimgRadio: './BgImg/eastLossantos.jpg',
    genre: 'Latin / Chicano Rap',
    producer: 'Various',
    year: 2013,
    game: 'GTA V'
  }
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

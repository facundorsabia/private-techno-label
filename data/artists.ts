export interface Artist {
  id: string;
  name: string;
  image: string;
  bio: string;
  location: string;
  role: string;
  videoUrl?: string;
  links: {
    instagram?: string;
    soundcloud?: string;
    residentAdvisor?: string;
    spotify?: string;
  };
}

export const ARTISTS: Artist[] = [
  {
    id: 'benac',
    name: 'BENAC',
    image: '/images/artists/benac.png',
    bio: 'BENAC is a pillar of the Private Techno sound. His approach is deeply hypnotic, defined by harsh, dark textures and an unwavering commitment to the underground aesthetic. Operating with mechanical precision, his sound remains serious, modern, and relentlessly powerful for the darkest rooms.',
    location: 'Buenos Aires, ARG',
    role: 'DJ / Producer',
    videoUrl: 'guV1I_uCie8',
    links: {
      instagram: 'https://instagram.com/leanbenac',
      soundcloud: 'https://soundcloud.com/benactechno',
      spotify: 'https://open.spotify.com/intl-es/artist/1BjmRZha4iBAM9mHFPcXPP'
    }
  },
  {
    id: 'diofaro',
    name: 'DIOFARO',
    image: '/images/artists/diofaro.png',
    bio: 'Diofaro operates at the intersection of relentless groove and melodic exploration. A central figure in the Private Techno collective, his work introduces a subtle melodic touch without ever sacrificing the signature rawness and physical weight of the underground.',
    location: 'Buenos Aires, ARG',
    role: 'DJ / Producer',
    videoUrl: 'tHdLm-UBPcM',
    links: {
      instagram: 'https://instagram.com/diofaro',
      soundcloud: 'https://soundcloud.com/diofaro',
      spotify: 'http://open.spotify.com/intl-es/artist/4OzERILFUd0ZbL8kOwAQTw'
    }
  }
];

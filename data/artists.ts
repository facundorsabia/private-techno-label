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
    bio: 'BENAC is a pillar of the Private Techno sound. His approach to techno is defined by mechanical precision, rhythmic complexity, and an unwavering commitment to the industrial aesthetic.',
    location: 'Buenos Aires, ARG',
    role: 'DJ / Producer',
    videoUrl: 'guV1I_uCie8',
    links: {
      instagram: 'https://instagram.com/benac_music',
      soundcloud: 'https://soundcloud.com/benacmusic',
      spotify: 'https://open.spotify.com/artist/benac'
    }
  },
  {
    id: 'diofaro',
    name: 'DIOFARO',
    image: '/images/artists/diofaro.png',
    bio: 'Diofaro operates at the intersection of mathematical precision and organic decay. A central figure in the Private Techno collective, his work focuses on sound design and the emotional weight of industrial soundscapes.',
    location: 'Buenos Aires, ARG',
    role: 'DJ / Producer / Sound Designer',
    videoUrl: 'tHdLm-UBPcM',
    links: {
      instagram: 'https://instagram.com/diofaro',
      soundcloud: 'https://soundcloud.com/diofaro'
    }
  }
];

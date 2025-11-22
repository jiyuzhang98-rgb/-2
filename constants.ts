import { Album, AlbumCategory } from './types';

// Using high-quality Unsplash placeholders to simulate the catalog pages
// In a real scenario, these would be the specific screenshots provided.

const AURORA_PAGES = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600', // Dark aesthetic
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1600',
];

const BEALL_PAGES = [
  'https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80&w=1600', // Architectural
  'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600',
];

const RISING_PAGES = [
  'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1600', // Modern/Tech
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
];

const AVIA_PAGES = [
  'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1600', // Warm wood
  'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=1600',
];

const SEATING_PAGES = [
  'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&q=80&w=1600',
];

const SOFA_PAGES = [
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1600',
];

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'a1',
    title: 'Aurora 极光',
    category: AlbumCategory.WOOD,
    date: '2023年10月',
    cover: AURORA_PAGES[0],
    images: [...AURORA_PAGES, ...AURORA_PAGES], // Mocking more pages
  },
  {
    id: 'a2',
    title: 'Beall 博奥',
    category: AlbumCategory.WOOD,
    date: '2023年09月',
    cover: BEALL_PAGES[0],
    images: [...BEALL_PAGES, ...BEALL_PAGES],
  },
  {
    id: 'a3',
    title: 'Rising 智腾升降系列',
    category: AlbumCategory.LAMINATE,
    date: '2023年11月',
    cover: RISING_PAGES[0],
    images: [...RISING_PAGES, ...RISING_PAGES],
  },
  {
    id: 'a4',
    title: 'Avia 艾维亚',
    category: AlbumCategory.WOOD,
    date: '2024年01月',
    cover: AVIA_PAGES[0],
    images: [...AVIA_PAGES, ...AVIA_PAGES],
  },
  {
    id: 'a5',
    title: 'K-Task 任务椅系列',
    category: AlbumCategory.SEATING,
    date: '2023年08月',
    cover: SEATING_PAGES[0],
    images: [...SEATING_PAGES, ...SEATING_PAGES],
  },
  {
    id: 'a6',
    title: 'Cloud Lounge 云端沙发',
    category: AlbumCategory.SOFA,
    date: '2023年07月',
    cover: SOFA_PAGES[0],
    images: [...SOFA_PAGES, ...SOFA_PAGES],
  },
  {
    id: 'a7',
    title: 'Nexus 经理桌',
    category: AlbumCategory.LAMINATE,
    date: '2023年06月',
    cover: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1600',
    images: RISING_PAGES,
  },
  {
    id: 'a8',
    title: 'ErgoPro 人体工学椅',
    category: AlbumCategory.SEATING,
    date: '2023年05月',
    cover: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1600',
    images: SEATING_PAGES,
  }
];
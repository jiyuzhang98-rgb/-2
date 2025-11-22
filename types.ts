export interface Album {
  id: string;
  title: string;
  category: AlbumCategory;
  date: string;
  cover: string;
  images: string[];
  type?: 'image' | 'pdf';
  pdfUrl?: string;
}

export enum AlbumCategory {
  ALL = '所有',
  WOOD = '木制系列',
  LAMINATE = '防火板系列',
  SEATING = '座椅系列',
  SOFA = '沙发系列',
  CUSTOM = '自定义上传',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
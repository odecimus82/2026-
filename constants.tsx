
import React from 'react';
import { LocationOption } from './types';

export const LOCATIONS: LocationOption[] = [
  {
    id: 'location_a',
    name: '松山湖生态园',
    description: '优美的湖畔风景，配备专业的烧烤炉和团队游戏区域。JOJO 推荐，非常适合家庭散步。',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    tags: ['湖畔', '开阔场地', '亲子友好']
  },
  {
    id: 'location_b',
    name: '大岭山野炊农场',
    description: '原汁原味的柴火饭体验。更适合喜欢动手切菜、生火的“野炊”爱好者。',
    imageUrl: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d4ec?q=80&w=800&auto=format&fit=crop',
    tags: ['柴火灶', '农家乐', '沉浸式体验']
  }
];

export const CORSAIR_LOGO = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5L35 30H5L20 5Z" fill="#FACC15" />
    <path d="M20 12L30 28H10L20 12Z" fill="#09090B" />
  </svg>
);

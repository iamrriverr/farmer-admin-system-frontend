import type { MenuItem } from '@/types';

import { ICONS } from './icons';

// 側邊欄選單項目配置
export const NAVIGATION_ITEMS: MenuItem[] = [
  {
    id: 'new-chat',
    icon: ICONS.PLUS,
    label: '新對話',
    route: '/chat',
  },
  {
    id: 'conversation',
    icon: ICONS.CHAT,
    label: '對話歷史',
    route: '/chat',
  },
  {
    id: 'knowledge-base',
    icon: ICONS.BOOK,
    label: '知識庫',
    route: '/knowledge-base',
  },
  {
    id: 'eform',
    icon: ICONS.DOCUMENT,
    label: '電子表單',
    route: '/eform',
  },
  {
    id: 'departments',
    icon: ICONS.OFFICE_BUILDING,
    label: '部門管理',
    route: '/departments',
  },
  {
    id: 'staff',
    icon: ICONS.USERS,
    label: '人員管理',
    route: '/staff',
  },
];

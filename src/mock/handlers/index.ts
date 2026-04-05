import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { departmentHandlers } from './department';
import { eformHandlers } from './eform';
import { knowledgeHandlers } from './knowledge';
import { staffHandlers } from './staff';

export const handlers = [
  ...authHandlers,
  ...staffHandlers,
  ...departmentHandlers,
  ...knowledgeHandlers,
  ...eformHandlers,
  ...chatHandlers,
];

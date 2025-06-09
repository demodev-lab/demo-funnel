import { classroomHandlers } from './classroom'
import { adminHandlers } from './admin'

export const handlers = [
  ...classroomHandlers,
  ...adminHandlers,
] 
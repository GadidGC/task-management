import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum TASK_STATUS_TIME {
  LATE = 'late',
  ALMOST_LATE = 'almost late',
  ON_TIME = 'on time'
}

export function checkTaskStatus(taskDate: Date): TASK_STATUS_TIME  {
  const currentDate = new Date();
  const timeDifference = taskDate.getTime() - currentDate.getTime();
  const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (dayDifference < 0) {
    return TASK_STATUS_TIME.LATE;
  } 
  
  if (dayDifference <= 2) {
      return TASK_STATUS_TIME.ALMOST_LATE;
  } 
    
  return TASK_STATUS_TIME.ON_TIME;

} 
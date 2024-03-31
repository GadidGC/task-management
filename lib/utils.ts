import { PointEstimate } from "@/graphql/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { MouseSensor as LibMouseSensor, TouchSensor as LibTouchSensor } from '@dnd-kit/core';
import { MouseEvent, TouchEvent } from 'react';

// Block DnD event propagation if element have "data-no-dnd" attribute
const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
  let cur = event.target as HTMLElement;

  while (cur) {
      if (cur.dataset && cur.dataset.noDnd) {
          return false;
      }
      cur = cur.parentElement as HTMLElement;
  }

  return true;
};

export class MouseSensor extends LibMouseSensor {
  static activators = [{ eventName: 'onMouseDown', handler }] as typeof LibMouseSensor['activators'];
}

export class TouchSensor extends LibTouchSensor {
  static activators = [{ eventName: 'onTouchStart', handler }] as typeof LibTouchSensor['activators'];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum TASK_STATUS_TIME {
  LATE = "late",
  ALMOST_LATE = "almost late",
  ON_TIME = "on time",
}

export function checkTaskStatus(taskDate: Date): TASK_STATUS_TIME {
  const currentDate = new Date();
  const timeDifference = taskDate.getTime() - currentDate.getTime();
  const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (timeDifference < 0) {
    return TASK_STATUS_TIME.LATE;
  }

  if (dayDifference <= 2) {
    return TASK_STATUS_TIME.ALMOST_LATE;
  }

  return TASK_STATUS_TIME.ON_TIME;
}

export function convertEstimateToReadbleNumber(
  estimate: PointEstimate,
): string {
  if (estimate === PointEstimate.Eight) {
    return "8";
  }

  if (estimate === PointEstimate.Four) {
    return "4";
  }

  if (estimate === PointEstimate.Two) {
    return "2";
  }

  if (estimate === PointEstimate.One) {
    return "1";
  }

  return "0";
}

export function convertDeprecatedURL(
  deprecatedURL: string,
  name: string,
): string {
  const baseURL = "https://avatars.dicebear.com/api/initials/";
  const newName = name.replace(/\s/g, "").toLowerCase(); // Remove spaces and convert to lowercase
  const newURL = `https://api.dicebear.com/8.x/open-peeps/svg?flip=false&seed=${newName}`;

  if (deprecatedURL.startsWith(baseURL)) {
    const initials = deprecatedURL
      .substring(baseURL.length)
      .replace(".svg", "");
    return newURL.replace(newName, initials);
  }

  return deprecatedURL;
}

export function generateDiceBearUrl(name: string): string {
  const newName = name.replace(/\s/g, "").toLowerCase(); // Remove spaces and convert to lowercase
  const newURL = `https://api.dicebear.com/8.x/open-peeps/jpg?flip=false&seed=${newName}`;

  return newURL;
}

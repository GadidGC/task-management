import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Status } from "@/graphql/types";

export function Droppable(props: {
  id: string;
  status: Status;
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | Promise<React.AwaitedReactNode>
    | null
    | undefined;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: {
      id: props.id,
      status: props.status,
    },
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex w-full h-full">
      {props.children}
    </div>
  );
}

import React from 'react';
import { getBezierPath } from 'reactflow';

export default function RoughEdge(props) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    style,
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const seed = Math.abs(hashCode(id)) % 7;
  const dashVariants = [
    '12 5 10 6',
    '14 6 9 5',
    '10 4 12 5',
    '11 5 11 6',
    '13 5 9 6',
    '12 6 12 6',
    '10 6 14 5',
  ];
  const dashArray = dashVariants[seed];

  return (
    <g className="react-flow__edge" data-id={id}>
      {/* Shadow */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0,0,0,0.20)"
        strokeWidth={10}
        strokeLinecap="round"
        style={style}
      />
      {/* Main orange stroke */}
      <path
        d={edgePath}
        fill="none"
        stroke="#ff8c2a"
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashArray}
        style={style}
        markerEnd={markerEnd}
      />
      {/* Ink outline */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
      />
    </g>
  );
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}
  
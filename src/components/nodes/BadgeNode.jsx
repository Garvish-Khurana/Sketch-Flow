import React from 'react';
import { Handle, Position } from 'reactflow';

export default function BadgeNode({ data }) {
  return (
    <div className="group relative px-3 py-2 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-b 
      from-yellow-300 to-amber-400 border-2 border-black/70 shadow-[0_3px_0_rgba(0,0,0,0.25)] 
      flex items-center 
      justify-center">
        <span className="text-xl">{data.icon ?? '⚙️'}</span>
      </div>
      <div className="mt-1 text-[13px] font-extrabold text-neutral-900 drop-shadow-[1px_1px_0_rgba(255,255,255,0.6)] tracking-wide">
        {data.label}
      </div>

      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-orange-400 !border !border-black/50" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-orange-400 !border !border-black/50" />
    </div>
  );
}

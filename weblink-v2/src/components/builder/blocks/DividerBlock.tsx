"use client";

interface DividerBlockProps {
  data: any;
  onChange: (newData: any) => void;
}

export default function DividerBlock({ data, onChange }: DividerBlockProps) {
  const customStyle = {
    borderTopWidth: data?.content?.thickness ? `${data.content.thickness}px` : "1px",
    borderTopStyle: data?.content?.lineStyle || "solid",
    borderTopColor: data?.content?.lineColor || "#27272a", // zinc-800 default
  };

  return (
    <div className="w-full py-4 flex flex-col items-center justify-center p-3 bg-zinc-950/40 border border-zinc-900/60 rounded-xl">
      <hr className="w-4/5" style={customStyle} />
      <span className="text-[10px] text-zinc-600 font-mono tracking-widest mt-1.5 uppercase">Divider Block</span>
    </div>
  );
}

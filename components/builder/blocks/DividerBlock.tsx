"use client";

interface DividerBlockProps {
  data: any;
  onChange: (newData: any) => void;
}

export default function DividerBlock({ data, onChange }: DividerBlockProps) {
  return (
    <div className="w-full py-4 flex flex-col items-center justify-center p-3 bg-zinc-950/40 border border-zinc-900/60 rounded-xl">
      <hr className="w-4/5 border-t border-zinc-800" />
      <span className="text-[10px] text-zinc-600 font-mono tracking-widest mt-1.5 uppercase">Divider Block</span>
    </div>
  );
}

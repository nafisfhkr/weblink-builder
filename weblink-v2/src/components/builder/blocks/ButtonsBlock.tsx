export default function ButtonsBlock({ content }: { content: any }) {
  const items = content?.items || [];

  if (items.length === 0) {
    return (
      <div className="w-full py-3 text-center text-zinc-500 text-xs italic">
        Belum ada tombol
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 items-center">
      {items.map((item: any, i: number) => {
        const onClickAttr = item.onClick ? { onClick: new Function(item.onClick) } : {};
        return (
          <a
            key={item.id || i}
            href={item.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm block"
            {...onClickAttr as any}
          >
            <div
              className="w-full px-6 py-3.5 rounded-full text-center font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: item.bgColor || "#000000",
                color: item.textColor || "#ffffff",
                boxShadow: `0 4px 14px 0 ${item.bgColor || "#000"}40`
              }}
            >
              {item.label || "Tombol"}
            </div>
          </a>
        );
      })}
    </div>
  );
}

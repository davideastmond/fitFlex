interface BaseWidgetProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function BaseWidget({
  title,
  subtitle,
  children,
}: BaseWidgetProps) {
  return (
    <div
      className="blueGray"
      style={{
        height: "180px",
        width: "175px",
        borderRadius: "20px",
      }}
    >
      <div>
        <div className="pt-2">
          <h1 className="robotoFont text-base font-bold text-center text-white">
            {title}
          </h1>
          <div className="mt-2">
            <h2 className="verdanaFont text-2xl font-bold text-center text-white">
              {subtitle}
            </h2>
          </div>
        </div>
        <div className="w-48 h-40">{children}</div>
      </div>
    </div>
  );
}

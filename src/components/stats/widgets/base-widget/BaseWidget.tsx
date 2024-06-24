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
          <div>
            <h2
              className={`verdanaFont min-h-12 max-h-12 ${getResponsiveSubtitleFontSize(
                subtitle
              )} font-bold text-center text-white`}
            >
              {subtitle}
            </h2>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

const getResponsiveSubtitleFontSize = (subtitle: string) => {
  if (subtitle.length <= 10) {
    return "text-2xl";
  }

  return "text-md";
};

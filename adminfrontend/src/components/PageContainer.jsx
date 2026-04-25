const PageContainer = ({ title, children, action, subtitle }) => {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-800">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-dark-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default PageContainer;
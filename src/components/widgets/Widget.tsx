export default function Widget({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h2 className="text-dark-500 dark:text-light-500 pl-2 text-opacity-50 dark:text-opacity-50">
        {title}
      </h2>
      <section className="p-8 bg-light-400 dark:bg-dark-200 rounded-2xl h-full border border-opacity-60 dark:border-opacity-60 border-light-500 dark:border-dark-500">
        {children}
      </section>
    </div>
  );
}

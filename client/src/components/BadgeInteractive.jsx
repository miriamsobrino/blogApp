export const BadgeInteractive = ({ children, focus, onClick }) => {
  const handleClick = () => {
    onClick(children);
  };
  const className = ` text-sm  py-1 px-2 rounded-md text-center capitalize cursor-pointer   ${
    focus ? 'bg-slate-300 ' : 'bg-slate-100 '
  }`;

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export const Button = ({ children, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-1 px-4 font-bold rounded-md transition-all duration-200 border-2
        ${
          disabled
            ? ' cursor-not-allowed border-slate-300 border-2 hidden'
            : 'bg-sky-500 text-white border-sky-500 hover:text-sky-500 hover:bg-transparent hover:border-2 hover:border-sky-500 cursor-pointer'
        }`}
    >
      {children}
    </button>
  );
};

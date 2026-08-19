interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
}
export default function Button({
  title,
  icon,
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading}
      className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
    >
      {!loading && icon}
      {loading ? "Please Wait" : title}
    </button>
  );
}

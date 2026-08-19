import React from "react";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{label}</label>
          <input
            ref={ref}
            {...props}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  },
);
export default Input;

interface TextFieldProps extends React.ComponentProps<"input"> {
  label: string;
  name: string;
  errors?: string[];
}

export function TextField({ label, name, errors, className = "", ...props }: TextFieldProps) {
  const errorId = `${name}-error`;
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? errorId : undefined}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 ${className}`}
        {...props}
      />
      {errors && (
        <p id={errorId} className="text-xs text-red-600">
          {errors.join(" ")}
        </p>
      )}
    </div>
  );
}

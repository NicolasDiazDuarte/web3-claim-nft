import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  family?: "PRIMARY" | "SECONDARY" | "TERTIARY"; // Asegúrate de definir el tipo de "family"
}

export const ButtonComponent = ({
  children,
  family,

  ...props
}: ButtonComponentProps) => {
  return (
    <button
      {...props}
      className={cn(` ${props.className}`, {
        "font-bold bg-pink-dark text-[#060047] px-6 py-2 rounded-md hover:border-pink-dark hover:shadow-lg hover:shadow-black/10 transition-all duration-300 ease-in-out":
          family === "PRIMARY",
        "text-inf-dark-blue disabled:bg-inf-smoke hover:underline hover:underline-offset-1 hover:text-underline":
          family === "SECONDARY",
        "w-full px-6 py-2 text-lg font-medium text-gray-900 bg-white rounded-xl hover:shadow-lg transition-all duration-300 ease-in-out":
          family === "TERTIARY",
      })}
    >
      {children}
    </button>
  );
};

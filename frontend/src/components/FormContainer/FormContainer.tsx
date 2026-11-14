import type { FormHTMLAttributes, PropsWithChildren } from 'react';
import './FormContainer.css'

type FormContainerProps = PropsWithChildren<
  FormHTMLAttributes<HTMLFormElement>
>;

export function FormContainer({ children,
  className = '',
  ...props
}: FormContainerProps) {
  return (
    <form 
      className={`formContainer ${className}`} 
      {...props}
    >
      {children}
    </form>
  )
}
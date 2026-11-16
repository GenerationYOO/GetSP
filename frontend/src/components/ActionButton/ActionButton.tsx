import "./ActionButton.css"

type ActionButtonProps = {
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ActionButton({
  text,
  className = "",
  onClick,
  disabled,
}: ActionButtonProps) {
  return (
    <button 
      className={`actionButton ${className} ${disabled ? 'isDisabled' : ''}`} 
      onClick={onClick} 
      disabled={disabled}>
      {text}
    </button>
  )
}
import "./ActionButton.css"

type ActionButtonProps = {
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function ActionButton({
  text,
  className = "",
  onClick,
  disabled,
  type = "submit"
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={`actionButton ${className} ${disabled ? 'isDisabled' : ''}`}
      onClick={onClick}
      disabled={disabled}>
      {text}
    </button>
  )
}
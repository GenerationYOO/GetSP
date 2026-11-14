import "./ActionButton.css"

type ActionButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ActionButton({ text, onClick, disabled }: ActionButtonProps) {
  return (
    <button 
      className={`actionButton ${disabled ? 'isDisabled' : ''}`} 
      onClick={onClick} 
      disabled={disabled}>
      {text}
    </button>
  )
}
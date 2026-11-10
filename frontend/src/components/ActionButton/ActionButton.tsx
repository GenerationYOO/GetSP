import "./ActionButton.css"

export function ActionButton({ text, onClick, disabled }: { text: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button className={`actionButton ${disabled ? 'isDisabled' : ''}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  )
}
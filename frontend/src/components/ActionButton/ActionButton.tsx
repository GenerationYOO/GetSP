import "./ActionButton.css"

export function ActionButton({ text, onClick, disabled }: { text: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button className={`authButton ${disabled ? 'isDisabled' : ''}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  )
}
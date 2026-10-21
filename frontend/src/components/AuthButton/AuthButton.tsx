import "./AuthButton.css"

export function AuthButton({ text, onClick, disabled }: { text: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button className={`authButton ${disabled ? 'isDisabled' : ''}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  )
}
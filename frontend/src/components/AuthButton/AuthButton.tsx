import "./AuthButton.css"

export function AuthButton({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button className="authButton" onClick={onClick}>
      {text}
    </button>
  )
}
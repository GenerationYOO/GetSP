import "./AuthSwitch.css"

export function AuthSwitch({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      className="authSwitchButton"
      onClick={onClick}>
      {text}
    </button>
  )
}
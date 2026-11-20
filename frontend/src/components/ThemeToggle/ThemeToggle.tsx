import { useEffect, useState } from "react"
import "./ThemeToggle.css"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light"
  }, [isDark])

  return (
    <button
      className="themeToggle"
      type="button"
      aria-label="Переключить тему"
      aria-pressed={isDark}
      onClick={() => setIsDark((value) => !value)}
    >
      <span className="themeToggle__thumb" />
    </button>
  )
}
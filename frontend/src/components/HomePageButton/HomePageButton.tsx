import "./HomePageButton.css"

type HomePageButtonProps = {
  onClick?: () => void;
  leftIcon?: string;
  title?: string;
  description?: string;
  className?: string
}

export function HomePageButton({
  onClick,
  leftIcon,
  title,
  description,
  className,
}: HomePageButtonProps) {
  return (
    <button
      className={`home-page-button ${className ?? ""}`}
      onClick={onClick}
    >
      <div className="home-page-button__content">
        <img
          src={leftIcon}
          alt="Создать сессию"
          className="home-page-button__icon"
        />

        <div className="home-page-button__text">
          <h4 className="home-page-button__title">{title}</h4>
          <p className="home-page-button__description">{description}</p>
        </div>

        <span className="home-page-button__arrow" aria-hidden="true">
          →
        </span>
      </div>
    </button>
  )
}
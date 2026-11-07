import "./DevKit.css"
import { AuthButton } from "../../components/AuthButton/AuthButton"
import { AuthSwitch } from "../../components/AuthSwitch/AuthSwitch"
import { Checkbox } from "../../components/Checkbox/Checkbox"
import { InputRegisterForm } from "../../components/InputRegisterForm/InputRegisterForm"
import eyeIcon from "../../assets/icons/eye.svg"

export function DevKit() {
  return (
    <main className="devkit">

      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Buttons</h2>

        <div className="devkitGrid">
          <article className="devkitCard">
            <h3 className="devkitCardTitle">AuthButton</h3>
            <AuthButton text="AuthButton" onClick={() => { }} />
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">AuthSwitch</h3>
            <AuthSwitch
              text="AuthSwitch"
              onClick={() => { }} />
          </article>
        </div>
      </section>

      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Form controls</h2>

        <div className="devkitGrid">
          <article className="devkitCard">
            <h3 className="devkitCardTitle">Checkbox</h3>
            <Checkbox />
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">InputRegisterForm</h3>
            <InputRegisterForm
              title="InputRegisterForm"
              type="text"
              placeholder="Placeholder"
              leftIcon={eyeIcon}
              description="Description"
              error="Error"
            />
          </article>
        </div>
      </section>
    </main>
  )
}
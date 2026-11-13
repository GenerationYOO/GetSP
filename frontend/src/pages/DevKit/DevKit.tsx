import "./DevKit.css"
import { ActionButton } from "../../components/ActionButton/ActionButton"
import { AuthSwitch } from "../../components/AuthSwitch/AuthSwitch"
import { Checkbox } from "../../components/Checkbox/Checkbox"
import { InputForm } from "../../components/InputForm/InputForm"
import eyeIcon from "../../assets/icons/eye.svg"

export function DevKit() {
  return (
    <main className="devkit">

      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Buttons</h2>

        <div className="devkitGrid">
          <article className="devkitCard">
            <h3 className="devkitCardTitle">AuthButton</h3>
            <ActionButton text="AuthButton" onClick={() => { }} />
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
            <InputForm
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
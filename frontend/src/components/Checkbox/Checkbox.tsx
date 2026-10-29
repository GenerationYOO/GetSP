import "./Checkbox.css"

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <div className="checkbox">
      <input 
        type="checkbox" 
        id="checkbox" 
        className="checkboxInput"
        onChange={(e) => onChange?.(e.target.checked)}
        checked={checked}
        />
    </div>
  )
}
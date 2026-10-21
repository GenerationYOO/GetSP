import './InputRegisterForm.css'
import { useState } from 'react';


type Props = {
  title: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;

  leftIcon: string;
  rightIcon?: string;
  rightIconActive?: string;
  description?: string;
  error?: string;
  onBlur?: () => void;
};
export function InputRegisterForm(props: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <div className={"inputRegisterForm"}>
      <h3 className='inputTitle'>{props.title.toUpperCase()}</h3>
      <div className='inputWrapper'>
        <img className='inputLeftIcon' src={props.leftIcon} alt="left icon" />

        <input className={`inputField ${props.error ? 'hasError' : ''}`}
          type={props.type === 'password'
            ? (isPasswordVisible ? 'text' : 'password')
            : props.type}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange?.(e.target.value)}
          onBlur={props.onBlur}
          >

        </input>
        {props.rightIcon && (
          <button
            className='inputRightIconButton'
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            <img className='inputRightIcon'
              src={isPasswordVisible ? props.rightIconActive : props.rightIcon}
              alt="right icon" />
          </button>
        )}
      </div>
      <div
        className={`inputMessage ${props.description ? 'hasDescription' : 'hasError'}`}
      >
        {props.description ? (
          <p className="inputDescription">{props.description}</p>
        ) : (
          <p className={`inputError ${props.error ? 'isVisible' : ''}`}>
            {props.error || '\u00A0'}
          </p>
        )}
      </div>
    </div>
  )
}
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

function getInputClassName(type: string, error?: string): string {
  const classes = ['inputField'];

  if (type === 'password') {
    classes.push('passwordInput');
  }

  if (error) {
    classes.push('hasError');
  }

  return classes.join(' ');
}

function getInputType(
  type: string,
  isPasswordVisible: boolean
): string {
  if (type === 'password') {
    return isPasswordVisible ? 'text' : 'password';
  }

  return type;
}

function getInputMessage(
  error?: string,
  description?: string
) : React.ReactNode {
  if(error) {
    return <p className="inputError isVisible">{error}</p>;
  }
  if(description) {
    return <p className="inputDescription">{description}</p>;
  }
  return <p className="inputError">
      {'\u00A0'}
    </p>;
}

export function InputRegisterForm(props: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputClassName = getInputClassName(props.type, props.error);
  const inputType = getInputType(props.type, isPasswordVisible);
  return (
    <div className={"inputRegisterForm"}>
      <h3 className='inputTitle'>{props.title.toUpperCase()}</h3>
      <div className='inputWrapper'>
        <img className='inputLeftIcon' src={props.leftIcon} alt="left icon" />

        <input
          className={inputClassName}
          type={inputType}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange?.(e.target.value)}
          onBlur={props.onBlur}
        />
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
        {getInputMessage(props.error, props.description)}
      </div>
    </div>
  )
}
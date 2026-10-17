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
};
export function InputRegisterForm(props: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <div className="inputRegisterForm">
      <h3 className='inputTitle'>{props.title.toUpperCase()}</h3>
      <div className='inputWrapper'>
        <img className='inputLeftIcon' src={props.leftIcon} alt="left icon" />

        <input className='inputField' 
          type={props.type === 'password'
            ? (isPasswordVisible ? 'text' : 'password')
            : props.type} 
          placeholder={props.placeholder} 
          value={props.value} 
          onChange={(e) => props.onChange?.(e.target.value)}>
        
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
      
      <p className='inputDescription'>{props.description}</p>
    </div>
  )
}
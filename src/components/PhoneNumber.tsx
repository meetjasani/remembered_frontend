import { string } from "prop-types";
import React from "react";
import InputMask from 'react-input-mask';

interface Props {
    name: string;
    value: string;
    InputstyleClass: string;
    onChange: (e: object) => void;
    placeholder: string;
    disabled?: boolean;
    maxLength: number;
}


const NumberInput: React.FC<Props> = ({ name, value, InputstyleClass, onChange, disabled, placeholder, maxLength }) => {

    const handleChange = (event: { target: { value: any; }; }) => {
        const { value } = event.target;
        const re = /^[0-9\b]+$/;

        if (!value || value === "" || re.test(value)) {
            onChange(event);
        }

    }

    return (
        <>
            <InputMask mask="99/99/9999" 
             
                    className={InputstyleClass}
                    autoComplete="off"
                    disabled={disabled}
                    onChange={handleChange}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    maxLength={maxLength}
                
            />
            
        </>
    );
}

export default NumberInput;
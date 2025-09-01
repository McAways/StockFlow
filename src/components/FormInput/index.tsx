'use client'

interface FormInputProps {
    labelText?: string,
    labelClass: string,
    inputClass: string,
    type: string,
    className: string,
    id: string,
    placeholder: string,
    maxLenght?: number,
    value: string,
    handleUpdate?: any,
    handleDisabled?: any,
    fontColor?: any
}

export default function FormInput({ labelText, labelClass, inputClass, type, className, id, 
    placeholder, maxLenght, value, handleUpdate, handleDisabled, fontColor } : FormInputProps) {

    return (
        <div className={inputClass}>
            <label htmlFor={id} className={labelClass} style={{color: fontColor}}> { labelText } </label>
            <input
                type={type}
                className={className}
                id={id}
                placeholder={placeholder}
                maxLength={maxLenght}
                value={value}
                onChange={handleUpdate}
                disabled={handleDisabled}
                style={{color: fontColor}}
            />
        </div>
    )
}

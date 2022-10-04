import React from "react"

export default function InputField(type, value, placeholder, label, name, onChange) {
    return (
        <div className="form-group">
            {label && <label htmlFor="input-field">{label}</label>}
            <input
                type={type}
                value={value}
                name={name}
                className="form-control"
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    )
}

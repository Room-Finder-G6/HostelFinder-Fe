import React from 'react';

interface FormSelectProps {
    label: string;
    name: string;
    value: string | number;
    options: { label: string; value: number }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, value, options, onChange, required }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="form-control"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormSelect;

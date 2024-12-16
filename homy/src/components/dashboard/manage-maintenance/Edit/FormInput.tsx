import React from 'react';
import { Form } from 'react-bootstrap';

interface FormInputProps {
    label: string;
    name: string;
    value: string | number | null;
    type: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
                                                 label,
                                                 name,
                                                 value,
                                                 type,
                                                 placeholder,
                                                 onChange,
                                                 required,
                                             }) => {
    return (
        <Form.Group controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                placeholder={placeholder}
                name={name}
                value={value || ''}
                onChange={onChange}
                required={required}
            />
        </Form.Group>
    );
};

export default FormInput;

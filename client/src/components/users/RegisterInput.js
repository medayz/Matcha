import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RegisterInput = ({
    label,
    type,
    name,
    id,
    placeholder,
    onChange,
    err,
    value
}) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input type={type}
                name={name}
                id={id}
                value={value}
                placeholder={placeholder}
                className={classnames('form-control', {'is-invalid': err})}
                onChange={onChange} 
               />
            {err && <div className="invalid-feedback"> {err} </div>}
        </div>
    )
    
}

RegisterInput.propTypes = {
    label: PropTypes.string.isRequired,
    type:  PropTypes.string.isRequired,
    name:  PropTypes.string.isRequired,
    id:  PropTypes.string.isRequired,
    placeholder:  PropTypes.string.isRequired
}

export default RegisterInput;

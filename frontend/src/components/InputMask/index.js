import React, { useRef, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { useField } from '@rocketseat/unform';

export default function Mask({ name, inputMask, ...rest }) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [mask, setMask] = useState(defaultValue || '');

  // useEffect(() => {
  //   setMask(defaultValue || '');
  // }, [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value',
      clearValue: (pickerRef) => {
        pickerRef.setInputValue(null);
      },
    });
  }, [ref.current, fieldName]);

  function handleMask(e) {
    const { value } = e.target;
    return setMask(value);
  }

  return (
    <>
      <InputMask
        name={fieldName}
        mask={inputMask}
        value={mask}
        onChange={(e) => handleMask(e)}
        ref={ref}
        {...rest}
      />
      {error && <span>{error}</span>}
    </>
  );
}

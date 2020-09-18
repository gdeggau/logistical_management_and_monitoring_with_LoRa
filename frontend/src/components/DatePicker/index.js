import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import { DatePickerStyled } from "./styles";
import { InputStyled } from "~/components/ReactstrapModified";
// import { format } from "date-fns";
// import pt from "date-fns/locale/pt";

export const DatePickerField = ({ ...props }) => {
  //   console.log(props);
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  const CustomInput = ({ value, onClick }) => (
    <InputStyled onClick={onClick} value={value} readOnly={true} />
  );

  const MyComp = React.forwardRef((props, ref) => (
    <CustomInput innerRef={ref} {...props} />
  ));
  return (
    <DatePickerStyled>
      <DatePicker
        {...field}
        {...props}
        showTimeSelect
        dateFormat="MM/dd/yyyy hh:mm aa"
        customInput={<MyComp />}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
          setFieldValue(field.name, val);
        }}
      />
    </DatePickerStyled>
  );
};

export default DatePickerField;

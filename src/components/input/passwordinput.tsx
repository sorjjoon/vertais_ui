import { Box } from "@chakra-ui/react";
import React, { InputHTMLAttributes } from "react";
import TextInputfield from "../textinputfield";

type passwordProps = InputHTMLAttributes<HTMLInputElement> & {
  showPassword2?: boolean;
  validate?: boolean;
  passwordLabel?: string;
  password2Label?: string;
};
export const PasswordInput: React.FC<passwordProps> = ({ showPassword2, passwordLabel, password2Label }, props) => {
  return (
    <Box>
      <TextInputfield
        type="password"
        name="password"
        placeholder="Salasana"
        label={passwordLabel || "Salasana"}
        isRequired={false}
        autoComplete="off"
        {...props}
      />

      {showPassword2 ? (
        <TextInputfield
          type="password"
          name="password2"
          placeholder="Vahvista salasana"
          label={password2Label || "Vahvista salasana"}
          isRequired={false}
          autoComplete="off"
          {...props}
        />
      ) : null}
    </Box>
  );
};

export default PasswordInput;

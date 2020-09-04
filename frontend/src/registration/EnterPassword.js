import React from "react";
import styled from "styled-components";
import { AppColor } from "../styled/global";
import { Input, InputTitle } from "../base/Input";
import { GradientButton } from "../base/Button";

const Body = styled.div`
  background: ${AppColor.bodyView};
`;

const FlexBox = styled.div`
  padding: 52px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputFlexBox = styled.div`
  display: flex;
  flex-direction: column;

  & > input {
    margin-top: 5px;
    margin-bottom: 32px;
  }

  & > span {
    text-align: left;
  }
`;

const ErrorTitle = styled(InputTitle)`
  color: red;
  visibility: ${(props) => (!props.isValid ? "unset" : "hidden")};
`;

const getValidationErrorsDefault = () => ({
  message: "No errors",
  isValid: true,
});
function EnterPassword(props) {
  const [validationErrors, setValidationErrors] = React.useState(
    getValidationErrorsDefault()
  );
  const [formState, setFormState] = React.useState({
    password: "",
    repeatedPassword: "",
  });

  const handleValidation = () => {
    const { password, repeatedPassword } = formState;

    if (!password || !repeatedPassword) {
      return Error("Enter valid password");
    }

    if (password !== repeatedPassword) {
      return Error("Passwords must match");
    }
  };

  const handleNext = () => {
    const validationError = handleValidation();

    if (validationError) {
      setValidationErrors({ message: validationError.message, isValid: false });

      return;
    }

    setValidationErrors(getValidationErrorsDefault());

    props.handlePasswordUpdate(formState.password);
    props.onNext();
  };

  const handleFormChange = (event) => {
    const field = event.target.name;

    setFormState({
      ...formState,
      [field]: event.target.value,
    });
  };

  return (
    <Body>
      <FlexBox>
        <InputFlexBox>
          <ErrorTitle isValid={validationErrors.isValid}>
            {validationErrors.message}
          </ErrorTitle>
          <InputTitle>Enter node password</InputTitle>
          <Input
            name="password"
            value={formState.password}
            onChange={handleFormChange}
            type="password"
          />
        </InputFlexBox>
        <InputFlexBox>
          <InputTitle>Repeat node password</InputTitle>
          <Input
            name="repeatedPassword"
            value={formState.repeatedPassword}
            onChange={handleFormChange}
            type="password"
          />
        </InputFlexBox>
        <GradientButton onClick={handleNext}>Next</GradientButton>
      </FlexBox>
    </Body>
  );
}

export default EnterPassword;

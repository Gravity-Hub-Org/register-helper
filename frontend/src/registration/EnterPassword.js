import React from "react";
import styled from "styled-components";
import { AppColor } from "../styled/global";
import { Input, InputTitle } from "../base/Input";
import { GradientButton, GradientLink } from "../base/Button";
import { baseURL } from '../services/base'


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
  const { title, appState } = props

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

    props.onNext();
  };

  const handleFormChange = (event) => {
    const field = event.target.name;

    setFormState({
      ...formState,
      [field]: event.target.value,
    });
  };

  React.useEffect(() => {
    if (validationErrors.isValid) {
      props.onPasswordUpdate(formState.password);
    }
  }, [validationErrors.isValid, formState.password])

  const { value: applicationState, message: applicationStateMessage } = appState

  const nextButton = applicationState !== 0 ? (
    <GradientLink target="_blank" download href={`${baseURL}/download?password=${formState.password}`}>{title}</GradientLink>
  ) : (
    <GradientButton onClick={handleNext}>{title}</GradientButton>
  )

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
        {nextButton}
      </FlexBox>
    </Body>
  );
}

export default EnterPassword;

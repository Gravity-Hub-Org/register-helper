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

function EnterPassword(props) {
  return (
    <Body>
      <FlexBox>
        <InputFlexBox>
          <InputTitle>Enter node password</InputTitle>
          <Input />
        </InputFlexBox>
        <InputFlexBox>
          <InputTitle>Repeat node password</InputTitle>
          <Input />
        </InputFlexBox>
        <GradientButton>Next</GradientButton>
      </FlexBox>
    </Body>
  );
}

export default EnterPassword;

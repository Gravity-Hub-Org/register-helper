import styled from "styled-components";
import { AppColor, AppFonts } from "../styled/global";

export const InputTitle = styled.span`
  font-family: ${AppFonts.baseText};
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 19px;
  color: ${AppColor.inputTitle};
`;

export const Input = styled.input`
  font-family: ${AppFonts.baseText};
  margin: 0;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 19px;
  background: ${AppColor.headingTitle};
  border-radius: 6px;
  height: 42px;
  min-width: 400px;
  width: 400px;
  border: none;
  
  &:focus {
    outline: none;
  }
`;

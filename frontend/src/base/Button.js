import styled from "styled-components";
import { AppColor, AppFonts } from "../styled/global";

export const GradientButton = styled.button`
  background: linear-gradient(
    345.07deg,
    #262940 -63.33%,
    #414562 26.56%,
    #23263e 147.98%
  );
  border: 1px solid #878ea1;
  box-sizing: border-box;
  border-radius: 6px;

  font-family: ${AppFonts.baseText};
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 19px;
  /* identical to box height */

  color: ${AppColor.headingTitle};

  height: 38px;
  min-width: 400px;

  cursor: pointer;

  &:focus {
    border: none;
    outline: none;
  }

  &:hover {
    color: ${AppColor.background};
    background: ${AppColor.headingTitle};
  }

  transition: background 0.5s ease-in-out, color 0.5s ease-in-out;
`;

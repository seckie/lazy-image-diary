import * as React from "react";
import { shallow } from "enzyme";
import { Lead, IProps as ILeadProps } from "../../components/Lead/Lead";

describe("Lead component", () => {
  describe("props", () => {
    it('onClickSignIn prop should be set to "onClick" of the button', () => {
      const props: ILeadProps = {
        onClickSignIn: jest.fn()
      };
      const el = shallow(<Lead {...props} />);
      const btn = el.find(".btn");
      expect(btn.prop("onClick")).toEqual(props.onClickSignIn);
      btn.simulate("click");
      expect(props.onClickSignIn).toBeCalled();
    });
  });
  describe("render", () => {
    it("div.lead", () => {
      const props: ILeadProps = {
        onClickSignIn: jest.fn()
      };
      const el = shallow(<Lead {...props} />);
      expect(el.find("div.lead")).toHaveLength(1);
    });
  });
});

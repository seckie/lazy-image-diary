import * as React from "react";
import { shallow } from "enzyme";
import {
  Default,
  mapStateToProps,
  mapDispatchToProps
} from "../../containers/Default";
import actions from "../../actions";
import { Lead } from "../../components/Lead/Lead";

describe("Default", () => {
  describe("mapStateToProps", () => {
    const state = {
      test: "test"
    };
    it("just return state without mutation", () => {
      expect(mapStateToProps(state)).toEqual(state);
    });
  });
  describe("mapDispatchToProps", () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);
    const RES = "sign in response";
    const signInSpy = jest
      .spyOn(actions, "signIn")
      .mockImplementation((): any => RES);
    it("onClickSignIn() method calls dispatched signIn()", () => {
      props.onClickSignIn();
      expect(signInSpy).toBeCalled();
      expect(dispatch).toBeCalledWith(RES);
    });
  });
  describe("render", () => {
    const props = {
      onClickSignIn: jest.fn()
    };
    it('Lead component with "onClickSignIn" prop', () => {
      const el = shallow(<Default {...props} />);
      expect(el.find(Lead).prop("onClickSignIn")).toEqual(props.onClickSignIn);
    });
  });
});

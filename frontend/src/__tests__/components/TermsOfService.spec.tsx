import * as React from "react";
import { shallow } from "enzyme";

import { TermsOfService } from "../../components/TermsOfService";

describe("TermsOfService component", () => {
  describe("render", () => {
    it("div.termsofservice exists", () => {
      const el = shallow(<TermsOfService />);
      expect(el.find("div.termsofservice")).toHaveLength(1);
    });
  });
});

import * as React from "react";
import { storiesOf } from "@storybook/react";

const stories = storiesOf("Components", module);

stories.add("Lead", () => {
  return <button>foo</button>;
});

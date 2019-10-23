import React from "react";
import { mount } from "enzyme";
import Xbdd from "../Xbdd";

describe("Xbdd", () => {
  test("it renders without failing", () => {
    const app = mount(<Xbdd />);
    expect(app.find(".xbdd-app")).not.toBeNull();
  });
});

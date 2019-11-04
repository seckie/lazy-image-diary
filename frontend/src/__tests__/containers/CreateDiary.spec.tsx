import * as React from "react";
import { shallow, mount } from "enzyme";
import {
  CreateDiary,
  mapStateToProps,
  mapDispatchToProps
} from "../../containers/CreateDiary";
import actions from "../../actions";
import { act } from "react-dom/test-utils";

describe("CreateDiary", () => {
  const TOKEN = "token";
  const USER_NAME = "name";
  const FILE1 = {
    file: { name: "file1" },
    path: "path1"
  };
  const FILE2 = {
    file: { name: "file2&()\\" },
    path: "path2"
  };

  describe("mapStateToProps", () => {
    const state = {
      test: "test"
    };
    it("just return state without mutation", () => {
      expect(mapStateToProps(state)).toEqual(state);
    });
  });
  describe("mapDispatchToProps", () => {
    it("onChange() method calls dispatched fileFieldOnChange()", () => {
      const dispatch = jest.fn();
      const props = mapDispatchToProps(dispatch);
      const RES = "sign in response";
      const actionSpy = jest
        .spyOn(actions, "fileFieldOnChange")
        .mockImplementation((): any => RES);
      const ev: any = {};
      props.onChange(ev);
      expect(actionSpy).toBeCalled();
      expect(dispatch).toBeCalledWith(RES);
    });
    it("onSubmit() method calls dispatched uploadFiles()", () => {
      const dispatch = jest.fn();
      const props = mapDispatchToProps(dispatch);
      const DATASET: any = ["data1", "data2"];
      const RES: any = "uploadFiles response";
      const actionSpy = jest
        .spyOn(actions, "uploadFiles")
        .mockImplementation((): any => RES);
      props.onSubmit(DATASET);
      expect(actionSpy).toBeCalledWith(DATASET);
      expect(dispatch).toBeCalledWith(RES);
    });
  });
  describe("render", () => {
    const props: any = {
      user: {
        name: USER_NAME
      },
      fileDataset: [],
      onChange: jest.fn()
    };
    it("display user.name", () => {
      const el = shallow(<CreateDiary {...props} />);
      expect(el.find(".userInfo").text()).toBe(`Evernote ID: ${USER_NAME}`);
    });
    it('set onChange to input[type="file"]', () => {
      const localProps = {
        ...props,
        onChange: jest.fn()
      };
      const el = shallow(<CreateDiary {...localProps} />);
      el.find('input[type="file"]').simulate("change");
      expect(localProps.onChange).toBeCalled();
    });
    it("set onSubmit to the button", () => {
      const localProps = {
        ...props,
        onSubmit: jest.fn()
      };
      const el = shallow(<CreateDiary {...localProps} />);
      el.find(".uploadInput button").simulate("click");
      expect(localProps.onSubmit).toBeCalled();
    });

    describe("isUploading props", () => {
      const localProps: any = {
        ...props,
        isUploading: true,
        fileDataset: [FILE1, FILE2]
      };
      const el = shallow(<CreateDiary {...localProps} />);
      it('All medias in "mediaList____undone" container have "media____uploading" className', () => {
        const medias = el.find(".mediaList____undone .media");
        expect(medias.at(0).hasClass("media____uploading")).toBe(true);
        expect(medias.at(1).hasClass("media____uploading")).toBe(true);
      });
      it("Upload button should be disabled", () => {
        expect(el.find(".uploadInput button").prop("disabled")).toBe(true);
      });
    });

    describe("fileDataset props", () => {
      it("IMG attributes should use each data", () => {
        const localProps: any = {
          ...props,
          fileDataset: [FILE1, FILE2]
        };
        const el = shallow(<CreateDiary {...localProps} />);
        const medias = el.find(".mediaList____undone .media");
        expect(
          medias
            .at(0)
            .find("img")
            .prop("src")
        ).toBe(FILE1.path);
        expect(
          medias
            .at(1)
            .find("img")
            .prop("src")
        ).toBe(FILE2.path);
        expect(
          medias
            .at(0)
            .find("img")
            .prop("title")
        ).toBe(escape(FILE1.file.name));
        expect(
          medias
            .at(1)
            .find("img")
            .prop("title")
        ).toBe(escape(FILE2.file.name));
        expect(
          medias
            .at(0)
            .find("img")
            .prop("alt")
        ).toBe(escape(FILE1.file.name));
        expect(
          medias
            .at(1)
            .find("img")
            .prop("alt")
        ).toBe(escape(FILE2.file.name));
      });
      it("Display empty list if fileDataset props is undefined", () => {
        const localProps = {
          ...props,
          fileDataset: undefined
        };
        const el = shallow(<CreateDiary {...localProps} />);
        expect(el.find(".media____empty").length).toBe(5);
      });
      it("Display empty list if fileDataset props is an empty list", () => {
        const localProps = {
          ...props,
          fileDataset: []
        };
        const el = shallow(<CreateDiary {...localProps} />);
        expect(el.find(".media____empty").length).toBe(5);
      });
    });

    describe("uploadedFileDataset props", () => {
      it("IMG attributes should use each data", () => {
        const localProps: any = {
          ...props,
          uploadedFileDataset: [FILE1, FILE2]
        };
        const el = shallow(<CreateDiary {...localProps} />);
        const medias = el.find(".mediaList____done .media");
        expect(
          medias
            .at(0)
            .find("img")
            .prop("src")
        ).toBe(FILE1.path);
        expect(
          medias
            .at(1)
            .find("img")
            .prop("src")
        ).toBe(FILE2.path);
        expect(
          medias
            .at(0)
            .find("img")
            .prop("title")
        ).toBe(escape(FILE1.file.name));
        expect(
          medias
            .at(1)
            .find("img")
            .prop("title")
        ).toBe(escape(FILE2.file.name));
        expect(
          medias
            .at(0)
            .find("img")
            .prop("alt")
        ).toBe(escape(FILE1.file.name));
        expect(
          medias
            .at(1)
            .find("img")
            .prop("alt")
        ).toBe(escape(FILE2.file.name));
      });
      it("Display nothing if uploadedFileDataset props is undefined", () => {
        const localProps = {
          ...props,
          uploadedFileDataset: undefined
        };
        const el = shallow(<CreateDiary {...localProps} />);
        expect(el.find(".mediaList____done")).toHaveLength(0);
      });
      it("Display nothing if uploadedFileDataset props is an empty list", () => {
        const localProps = {
          ...props,
          uploadedFileDataset: []
        };
        const el = shallow(<CreateDiary {...localProps} />);
        expect(el.find(".mediaList____done")).toHaveLength(0);
      });
    });

    describe("errorMessages props", () => {
      const MESSAGES = ["foo", "bar"];
      const localProps: any = {
        ...props,
        errorMessages: MESSAGES
      };
      const el = shallow(<CreateDiary {...localProps} />);
      it('has "messages__item"s that includes each messages', () => {
        const items = el.find(".messages__item");
        expect(items.length).toBe(MESSAGES.length);
        expect(
          items
            .at(0)
            .text()
            .trim()
        ).toBe(MESSAGES[0]);
        expect(
          items
            .at(1)
            .text()
            .trim()
        ).toBe(MESSAGES[1]);
      });
    });

    describe("resultMessages props", () => {
      const MESSAGES = ["foo", "bar"];
      const localProps: any = {
        ...props,
        resultMessages: MESSAGES
      };
      const el = shallow(<CreateDiary {...localProps} />);
      it('has "messages__item"s that includes each messages', () => {
        const items = el.find(".messages__item");
        expect(items.length).toBe(MESSAGES.length);
        expect(
          items
            .at(0)
            .text()
            .trim()
        ).toBe(MESSAGES[0]);
        expect(
          items
            .at(1)
            .text()
            .trim()
        ).toBe(MESSAGES[1]);
      });
    });
  });
  describe("Redirect", () => {
    const props: any = {
      user: {
        name: USER_NAME
      },
      fileDataset: [],
      onChange: jest.fn()
    };
    it("If there is no Token, redirect to index", () => {
      const history: any = {
        replace: jest.fn()
      };
      const localProps = {
        ...props,
        history
      };
      act(() => {
        mount(<CreateDiary {...localProps} />);
      });
      expect(history.replace).toBeCalledWith("/");
    });
    it("If there is a Token, not to redirect", () => {
      window.sessionStorage.setItem("accessToken", TOKEN);
      const history: any = {
        replace: jest.fn()
      };
      const localProps = {
        ...props,
        history
      };
      act(() => {
        mount(<CreateDiary {...localProps} />);
      });
      expect(history.replace).not.toBeCalled();
      window.sessionStorage.removeItem("accessToken");
    });
  });
});

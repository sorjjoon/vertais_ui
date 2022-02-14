import { Box } from "@chakra-ui/react";
import React from "react";
import { uuid } from "../../utils/utils";

interface RichtextProps {
  id?: string;
  oldData?: string | null;
  onUpdate?: (newData: { answerHTML: string; answerText?: string; imageCount?: number }) => void;
}
class Richtext extends React.Component<RichtextProps> {
  private containerId: string;
  private toolbarId: string;
  private data: string;
  private toolBarRef: React.RefObject<HTMLDivElement>;
  private containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: RichtextProps) {
    super(props);
    this.containerId = props.id || uuid("abitti-");
    this.toolbarId = this.containerId + "-toolbar";

    this.data = props.oldData ?? "";

    this.handleUpdate = this.handleUpdate.bind(this);
    this.stateHasChanged = this.stateHasChanged.bind(this);

    this.toolBarRef = React.createRef();
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    const answer = this.containerRef.current!;
    answer.innerHTML = this.data;
    window.makeRichText(
      answer,
      {
        screenshot: {
          saver: ({ data }: any) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (evt) => {
                const res = evt.target?.result as string;
                return resolve(res.replace(/^(data:image)(\/[^;]+)(;.*)/, "$1$3"));
              };
              reader.readAsDataURL(data);
            }),
        },
        baseUrl: window.location.origin,
        updateMathImg: async ($img: any, latex: string) => {
          Richtext.updateMath(latex, (svg: string) => {
            $img.prop({
              src: svg,
              alt: latex,
            });
            $img.closest('[data-js="answer"]').trigger("input");
          });
        },
      },
      (newData) => {
        this.handleUpdate(newData);
      }
    );
    answer.innerHTML = this.data; //This is useless? Sometimes??!?!
    this.handleUpdate({ answerHTML: this.data });
  }
  componentDidUpdate(prevProps: RichtextProps, prevState: {}) {
    if (this.stateHasChanged(prevProps, prevState)) {
      const answer = this.containerRef.current!;
      answer.innerHTML = this.props.oldData!;
      this.handleUpdate({ answerHTML: this.props.oldData! });
    }
  }
  shouldComponentUpdate(nextProps: RichtextProps, nextState: {}) {
    return this.stateHasChanged(nextProps, nextState);
    //
  }

  stateHasChanged(prevProps: RichtextProps, prevState: {}) {
    return (
      this.props.oldData != undefined && prevProps.oldData !== this.props.oldData && this.props.oldData !== this.data
    );
  }

  handleUpdate(newData: { answerHTML: string; answerText?: string; imageCount?: number }) {
    this.data = newData.answerHTML;
    if (this.props.onUpdate) {
      this.props.onUpdate(newData);
    }
  }

  render() {
    console.log("Rendering rich text");
    return (
      <Box>
        <div ref={this.toolBarRef} className=" abitti-toolbar-container" id={this.toolbarId}></div>
        <Box p={3} ref={this.containerRef} className="answer abitti-editor-container" id={this.containerId}></Box>
      </Box>
    );
  }
  private static updateMath(latex: string, cb: any) {
    latexToSvg(latex)
      .then((res) => {
        res.text().then((svg) => {
          cb("data:image/svg+xml;base64," + window.btoa(encodeMultibyteUnicodeCharactersWithEntities(svg)));
        });
      })
      .catch((err) => {
        console.error("Error in rich text updateMath cb", err);
        cb(errSvg);
      });
  }
}

function latexToSvg(latex: string) {
  const url = new URL("/api/rich-text", window.location.origin);
  url.searchParams.append("latex", latex);
  return fetch(url.toString(), {});
}

export default Richtext;

function encodeMultibyteUnicodeCharactersWithEntities(str: string) {
  return str.replace(/[^\x00-\xFF]/g, (c) => `&#${c.charCodeAt(0).toString(10)};`);
}

const errSvg =
  "data:image/svg+xml;base64," +
  window.btoa(
    `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="17px" height="15px" viewBox="0 0 17 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Group 2</title><defs></defs><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-241.000000, -219.000000)"><g transform="translate(209.000000, 207.000000)"><rect x="-1.58632797e-14" y="0" width="80" height="40"></rect><g transform="translate(32.000000, 12.000000)"><polygon id="Combined-Shape" fill="#9B0000" fill-rule="nonzero" points="0 15 8.04006 0 16.08012 15"></polygon><polygon id="Combined-Shape-path" fill="#FFFFFF" points="7 11 9 11 9 13 7 13"></polygon><polygon id="Combined-Shape-path" fill="#FFFFFF" points="7 5 9 5 9 10 7 10"></polygon></g></g></g></g></svg>`
  );

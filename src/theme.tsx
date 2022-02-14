import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints, Styles } from "@chakra-ui/theme-tools";
const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const styles: Styles = {
  global: (props) => ({
    ".file-list:empty": {
      display: "none",
    },
    form: { w: "100%", h: "100%", p: 0, m: 0 },
    html: {
      ".wrapper": {
        width: "100%",
        ml: "auto",
        mr: "auto",
        p: 5,
      },

      ".size-lg": {
        maxW: "1600px",
      },
      ".size-md": {
        maxW: "800px",
      },
      ".size-sm": {
        maxW: "400px",
      },
      ".size-auto": {
        maxW: "fit-content",
      },
      scrollBehavior: "smooth",
      ".date-picker-wrapper": {
        cursor: "pointer",
        border: "1px solid",
        borderColor: "inherit",
        py: 1,
        px: 2,
        borderRadius: "md",
      },
      ".date-picker-wrapper.has-error": {
        borderColor: "errorColor.100",
      },

      ".react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header": {
        textTransform: "capitalize",
      },
      ".rich-text-editor": {
        borderWidth: "1px",
        borderRadius: "md",
      },
      ".date-picker-wrapper:not(:only-child)": { w: "max-content" },
      "a.file-link, a.task-link, a.link, .link a": {
        color: "linkColor.100",
      },

      ".file-link.to-delete": { textDecor: "line-through", color: "gray" },
      ".error-message": { fontSize: "sm", color: "errorColor.100" },
      ".rich-text-wrapper": {
        w: "100%",
      },
      ".add-border": { borderWidth: "1px", borderRadius: "md" },
      ".no-size": { w: "0!important", h: "0!important", m: "0!important", p: "0!important" },
      ".comment": {
        ">div": {
          ":not(:empty)": {
            my: 1,
            ":first-of-type": {
              mt: 0,
            },
            ":last-of-type": {
              mb: 0,
            },
          },
        },
      },

      "div.comment-container": {
        my: 4,
        w: "100%",
        ".comment": {
          w: "100%",
        },
      },
      ".animate-shrink": { transition: "all 1.7s ease" },
      ".assignment": {
        ".task-list ": {
          ".submit-info": {
            ">*": {
              pl: "1.5em",
            },
            ".has-submit": {
              color: "green.200",
            },
            ".no-submit": {
              color: "red.200",
            },
          },
        },
      },

      ".submit-cancel-wrapper": {
        "> :not(style)": {
          "~ :not(style)": {
            marginInlineStart: "0!important",
          },
        },
        ".filling": {
          flexGrow: 1,
        },
      },
      ".submit-status-table": {
        th: {
          pl: 0,
        },
      },
      ".commentable-wrapper": {
        counterReset: "child-count",
        pos: "relative",
        zIndex: 0,
        w: "100%",
        ".feedback-wrapper": {
          pos: "relative",
          w: "max-content",
          maxW: "100%",
          ">*": {
            maxW: "95%",
          },
          img: {
            display: "inline",
            w: "100%",
          },
        },
        ".feedback-wrapper.has-feedback.img-child": {
          display: "flex",
          alignItems: "flex-start",
          _after: {
            fontSize: "1em",
            ml: "auto",
          },
        },
        ".feedback-wrapper.has-feedback": {
          _hover: { border: "2px solid #555" },
          border: "1px solid blue",
          p: "2px",
          counterIncrement: "child-count",
          _after: {
            content: '" ("counter(child-count)""',
            fontSize: "0.90em",
            verticalAlign: "super",
            w: "max-content",
            minW: "max-content",
            maxW: "5%",
            display: "inline-block",
            color: "blue",
            ml: "0.5em",
          },
        },
      },
      ".summary-table": {
        th: {
          w: "max-content",
          wordWrap: "normal",
          hyphens: "auto",
        },

        "td:first-child": { textAlign: "left" },
        td: { textAlign: "center" },
      },
      ".commentable-wrapper.can-modify": {
        ".feedback-wrapper": { _hover: { border: "2px solid #555" }, cursor: "pointer" },
        // ".feedback-wrapper.is-modifying": { border: "2px solid #555", cursor: "auto" },
      },
      ".md-wrapper": {
        w: "100%",

        maxW: { base: "100%", sm: "25em", md: "30em", lg: "50em" },
        h1: { fontWeight: "bolder", fontSize: "2em" },
        h2: { fontWeight: "bolder", fontSize: "1.5em" },
        h3: { fontWeight: "bolder", fontSize: "1.17em" },
        h4: { fontWeight: "bolder", fontSize: "1em" },
        h5: { fontWeight: "bolder", fontSize: "0.83em" },
        h6: { fontWeight: "bolder", fontSize: "0.67em" },
        a: { color: "linkColor.100" },
        p: { my: 2 },
        blockquote: { my: 4 },
        ul: {
          listStyleType: "disc",
          ml: 5,
          li: { my: 2 },
          ul: { li: { my: 0 } },
        },
        img: {
          maxWidth: "50%",
          minWidth: { base: "100%", sm: "16em" },
          float: { base: "none", sm: "right" },
          my: { base: 2, sm: 0 },
          ml: { base: 0, sm: 2 },
          fontSize: 0,
        },
      },
    },
  }),
};

const theme = extendTheme({
  colors: {
    linkColor: { 100: "#0098ff" },
    errorColor: { 100: "#cc0000" },
    mainColor: {
      0: "rgb(180, 219, 81)",
      10: "rgb(170, 207, 76)",
      20: "rgb(161, 196, 73)",
      30: "rgb(159, 194, 72)",
      40: "rgb(153, 186, 71)",
      50: "rgb(143, 173, 66)",
      60: "rgb(124, 150, 57)",
      70: "rgb(110, 133, 50)",
      80: "rgb(93, 112, 43)",
      90: "rgb(79, 94, 37)",
      100: "rgb(69, 82, 32)",
    },
  },
  margin: {
    base: { 1: "2%" },
  },
  components: {
    Button: {
      variants: {
        save: {
          bg: "mainColor.30",
          _hover: { bg: "mainColor.60", _disabled: { bg: "mainColor.60" } },
          _disabled: { bg: "mainColor.60" },

          color: "whiteAlpha.900",
          _focus: { borderColor: "inherit" },
          mt: 1,
        },
        cancel: {
          bg: "inherit",
          color: "blackAlpha.700",
          border: "none",
          _focus: { boxShadow: "none" },
          _hover: { color: "black", textDecor: "underline" },
        },
      },
    },
  },

  fonts,
  breakpoints,

  styles,
});

export default theme;

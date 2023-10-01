import { extendTheme } from "@chakra-ui/react";

const variantOutlined = () => ({
  field: {
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 0 0 2px var(--chakra-ui-focus-ring-color)",
    },
  },
});

const variantFilled = () => ({
  field: {
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 0 0 1px var(--chakra-ui-focus-ring-color)",
    },
  },
});

const variantFlushed = () => ({
  field: {
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 1px 0 0 var(--chakra-ui-focus-ring-color)",
    },
  },
});

const trimVariant = () => ({
  field: {
    _focus: {
      borderColor: "purple.300",
      boxShadow: "0 1px 0 0 purple.300",
    },
    _hover: {
      borderColor: "purple.800",
    },
  },
});

export const customTheme = extendTheme({
  styles: {
    global: {
      // Create a CSS variable with the focus ring color desired.
      // rgba function does not work here so use the hex value.
      // Either :host,:root or html work. body does not work for
      // button, checkbox, radio, switch.
      // html: {
      ":host,:root": {
        "--chakra-ui-focus-ring-color": "white",
      },
    },
  },
  shadows: {
    // This is also possible. Not sure I like inject this into
    // an existing theme section.
    // It creates a CSS variable named --chakra-shadows-focus-ring-color
    // 'focus-ring-color': 'rgba(255, 0, 125, 0.6)',
    outline: "0 0 0 3px var(--chakra-ui-focus-ring-color)",
  },
  components: {
    Table: {
      variants: {
        mytable: {
          th: {
            background: "#068D9D",
          },
          tr: {
            _even: {
              background: "#6abbc4",
            },
            _odd: { background: "#e6f4f5" },
          },
        },
      },
    },
    Input: {
      variants: {
        outline: variantOutlined,
        filled: variantFilled,
        flushed: variantFlushed,
        login: trimVariant,
      },
    },
    Select: {
      variants: {
        outline: variantOutlined,
        filled: variantFilled,
        flushed: variantFlushed,
        trim: trimVariant,
      },
    },
    Textarea: {
      variants: {
        outline: () => variantOutlined().field,
        filled: () => variantFilled().field,
        flushed: () => variantFlushed().field,
        trim: () => trimVariant().field,
      },
    },
  },
});

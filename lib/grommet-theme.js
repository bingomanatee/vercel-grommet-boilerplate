const baselineFontSizes = [
  18, // text,
  30, // l1,
  24, // l2,
  21, // l3,
  18,
];

const sizeScales = new Map([
  ['small', 0.9],
  ['medium', 1],
  ['large', 1.2],
  ['xlarge', 3],
  ['xxlarge', 6]
]);

function fontSize(level, size) {
  return {
    size: `${baselineFontSizes[level] * sizeScales.get(size)}px`,
    height: '125%',
    maxWidth: '100%',
  };
}

const headingFonts = new Map([
  [
    1,
    {
      family:
        '"San Francisco Display Black", "Helvetica Neue", "Helvetica", sans-serif',
    },
  ],
]);

const theme = {
  name: 'my theme',
  rounding: 4,
  spacing: 24,
  defaultMode: 'light',
  global: {
    colors: {
      link: {
        dark: '#0068a6',
        light:  '#003f64',
      },
      brand: {
        dark: '#54830d',
        light: '#42670a',
      },
      background: {
        dark: '#111111',
        light: '#FFFFFF',
      },
      'background-back': {
        dark: '#111111',
        light: '#EEEEEE',
      },
      'background-front': {
        dark: '#222222',
        light: '#FFFFFF',
      },
      'background-contrast': {
        dark: '#FFFFFF11',
        light: '#11111111',
      },
      text: {
        dark: '#EEEEEE',
        light: '#333333',
      },
      'text-strong': {
        dark: '#FFFFFF',
        light: '#000000',
      },
      'text-weak': {
        dark: '#CCCCCC',
        light: '#444444',
      },
      'text-xweak': {
        dark: '#8a8a8a',
        light: '#8a8a8a',
      },
      border: {
        dark: '#444444',
        light: '#CCCCCC',
      },
      control: 'brand',
      'active-background': 'background-contrast',
      'active-text': 'text-strong',
      'selected-background': 'brand',
      'selected-text': 'text-strong',
      'status-critical': '#a82c2c',
      'status-warning': '#FFAA15',
      'status-ok': '#008658',
      'status-unknown': '#CCCCCC',
      'status-disabled': '#CCCCCC',
      'graph-0': 'brand',
      'graph-1': 'status-warning',
      'section-head': '#44000c',
      'focus': 'rgba(255,115,0,0.5)'
    },
    font: {
      family: '"San Francisco" ,"Helvetica Neue", Helvetica, sans-serif',
    },
    active: {
      background: 'active-background',
      color: 'active-text',
    },
    hover: {
      background: 'active-background',
      color: 'active-text',
    },
    selected: {
      background: 'selected-background',
      color: 'selected-text',
    },
    focus: {
      outline: {
        color: 'focus',
        size: '3px'
      },
      solid: "3px 1px 0.8 0.4rem rgba(255,115,0,0.5)"
    }
    },
  chart: {},
  diagram: {
    line: {},
  },
  meter: {},
  tip: {
    content: {
      background: {
        color: 'background',
      },
      elevation: 'none',
      round: false,
    },
  },
  layer: {
    background: {
      dark: '#111111',
      light: '#FFFFFF',
    },
  },
  heading: {
    font: {
      family: 'San Francisco Display',
      height: '120%',
    },
    level: [1, 2, 3, 4, 5].reduce((memo, level) => {
      return {
        ...memo,
        [level]: {
          font: headingFonts.has(level) ? headingFonts.get(level) : {},
          small: fontSize(level, 'small'),
          medium: fontSize(level, 'medium'),
          large: fontSize(level, 'large'),
          xlarge: fontSize(level, 'xlarge'),
        },
      };
    }, {}),
  },
  paragraph: 'small,medium,large,xlarge,xxlarge'.split(',').reduce((memo, size) => {
    return { ...memo, [size]: fontSize(0, size) };
  }, {}),
  text: 'small,medium,large,xlarge,xxlarge'.split(',').reduce((memo, size) => {
    return { ...memo, [size]: fontSize(0, size) };
  }, {}),
  breakpoints: {
    small: {
      value: 768,
      borderSize: {
        xsmall: '1px',
        small: '2px',
        medium: '4px',
        large: '6px',
        xlarge: '12px',
      },
      edgeSize: {
        none: '0px',
        hair: '1px',
        xxsmall: '2px',
        xsmall: '3px',
        small: '6px',
        medium: '12px',
        large: '24px',
        xlarge: '48px',
      },
      size: {
        xxsmall: '24px',
        xsmall: '48px',
        small: '96px',
        medium: '192px',
        large: '384px',
        xlarge: '768px',
        full: '100%',
      },
    },
    medium: {
      value: 1024,
      size: {
        xxsmall: '24px',
        xsmall: '48px',
        small: '96px',
        medium: '192px',
        large: '384px',
        xlarge: '768px',
        full: '100%',
      },
    },
    large: {
      value: 1200,
      size: {
        xxsmall: '24px',
        xsmall: '48px',
        small: '96px',
        medium: '192px',
        large: '384px',
        xlarge: '768px',
        full: '100%',
      },
    },
    xlarge: {
      value: 1536,
    },
  },

};


export default theme;

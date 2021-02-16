module.exports = {
  presets: [
    [
      "next/babel",
      // {
      //   "preset-env": {},
      //   "transform-runtime": {},
      //   "styled-jsx": {},
      //   "class-properties": {}
      // }
    ],
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ],
};
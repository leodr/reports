module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.*", "./src/components/**/*.*"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
};

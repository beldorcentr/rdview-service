import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './compiled/index.js',
  output: {
    file: './dist/index.js',
    name: 'rdview-service',
    format: 'umd'
  },
  watch: {
    include: './compiled/**'
  },
  plugins: [
    commonjs()
  ]
}

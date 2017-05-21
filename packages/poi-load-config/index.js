const findBabelConfig = require('find-babel-config')
const findPostcssConfig = require('postcss-load-config')

/**
 * @typedef {Object} BabelConfig
 * @property {string} file The location of config file
 * @property {boolean} useConfig Whether to use this config file
 */

module.exports = class LoadConfig {
  /**
   * @param options
   * @param {string} [options.cwd=process.cwd] The path to find config file
   */
  constructor(options) {
    this.options = Object.assign({
      cwd: process.cwd()
    }, options)
  }

  /**
   * Check if babel config exists and whether to use it
   * @return {Promise<BabelConfig>}
   */
  babel() {
    // Check direct and parent directory
    return findBabelConfig(this.options.cwd, 1)
      .then(({ file, config }) => {
        return {
          file,
          useConfig: config && config.babelrc !== false
        }
      })
  }

  /**
   * Get PostCSS config
   * @return {Promise<Config>} Same as {@link https://github.com/michael-ciniawsky/postcss-load-config postcss-load-config}
   */
  postcss() {
    const handleError = err => {
      if (err.message.indexOf('No PostCSS Config found') === -1) {
        throw err
      }
      // Return empty options for PostCSS
      return {}
    }

    return findPostcssConfig({}, this.options.cwd, { argv: false })
      .catch(handleError)
  }
}

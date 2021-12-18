module.exports = {
  extends: require.resolve('@ostai/eslint-config'),
  globals: {
    document: true,
    window: true,
    is: true,
    when: true,
    host: true,
    MutationObserver: true
  }
}

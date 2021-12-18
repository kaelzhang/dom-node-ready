module.exports = {
  extends: require.resolve('@ostai/eslint-config'),
  globals: {
    document: true,
    window: true,
    exists: true,
    when: true,
    host: true,
    MutationObserver: true
  }
}

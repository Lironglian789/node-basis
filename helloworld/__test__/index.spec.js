test('测试hello world', () => {
  const ret = require('../index')
  expect(ret)
    .toBe('Hello World')
})
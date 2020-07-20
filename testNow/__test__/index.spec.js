test ('测试生成文件名', () => {
  const src = new(require('../index'))()
  const ret = src.getFileName('/abc/class.js')
  console.log('getFileName:', ret)
  expect(ret)
    .toBe('/abc/__test__/class.spec.js')
})

test('测试代码生成', () => {
  const src = new (require('../index'))()
  const ret = src.getSource('fun', 'class')
  console.log('ret', ret)
  expect(ret)
    .toBe(`
      test ('TEST fun', () => {
        const fun = require('../class')
        const ret = fun()
        // expect(ret)
        //  .toBe('test return')
      })
    `)
})

const fs = require('fs')
test('集成测试生成代码文件', () => {
  // 准备环境
  // 删除文件夹
  fs.rmdirSync(__dirname + '/data/__test__', {
    recursive: true // 迭代，如果有就删除
  })
  const src = new (require('../index'))()
  src.genJestSource(__dirname + '/data')
})

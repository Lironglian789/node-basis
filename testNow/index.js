const path = require('path')

module.exports = class TextNow {
  /**
   * 生成测试文件名
   * @param {*} fileName 代码文件名
   */
  getFileName (fileName) {
    const dirName = path.dirname(fileName) // 文件夹名
    const baseName = path.basename(fileName) // 文件名
    const extName = path.extname(fileName) // 扩展名
    const testName = baseName.replace(extName, `.spec${extName}`)

    return path.format({
      root: dirName + '/__test__/',
      base: testName
    })
  }

  /**
   * 
   * @param {*} methodName 方法名
   * @param {*} classFile 文件路径
   * @param {*} isClass 是否为class类
   */
  getSource (methodName, classFile, isClass = false) {
    console.log('getSource', methodName)
    return `
      test ('${'TEST ' + methodName}', () => {
        const ${isClass ? '{' + methodName + '}' : methodName} = require('${'../' + classFile}')
        const ret = ${methodName}()
        // expect(ret)
          .toBe('test return')
      })
    `
  }
}
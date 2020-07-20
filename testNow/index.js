const path = require('path')
const fs = require('fs')

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
        //  .toBe('test return')
      })
    `
  }

  genJestSource(sourcePath = path.resolve('./')) {
    const testPath = `${sourcePath}/__test__`
    if(!fs.existsSync(testPath)) {
      fs.mkdirSync(testPath)
    }
    // 遍历代码文件
    let list = fs.readdirSync(sourcePath)
    list.map(v => `${sourcePath}/${v}`) // 添加完整路径
      .filter(v => fs.statSync(v).isFile())  // 过虑文件
      .filter(v => v.indexOf('.spec') === -1) // 排除测试文件
      .map(v => this.genTestFile(v))
  }
  genTestFile (filename) {
    console.log('filename', filename)
    const testFileName = this.getFileName(filename)

    // 判断此文件是否存在
    if (fs.existsSync(testFileName)) {
      console.log('该测试代码已存在')
      return
    }
    const mod = require(filename)
    let source
    if (typeof mod === 'object') {
      source = Object.keys(mod)
      .map(v => this.getSource(v, path.basename(filename), true))
      .join('\n') // 给每行代码后面加上空格
    } else if (typeof mod === 'function') {
      const baseName = path.basename(filename)
      source = this.getSource(baseName.replace('.js', ''), baseName)
    }
    fs.writeFileSync(testFileName, source)
  }
}
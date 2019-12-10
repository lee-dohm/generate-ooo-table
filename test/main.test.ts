import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

describe('generate-ooo-table', () => {
  it('runs with basic inputs', () => {
    process.env['INPUT_TEAMNAME'] = 'test-org/test-team'
    process.env['INPUT_TOKEN'] = '1234567890abcdef'

    const ip = path.join(__dirname, '..', 'lib', 'main.js')

    const options: cp.ExecSyncOptions = {
      env: process.env
    }

    console.log(cp.execSync(`node ${ip}`, options).toString())
  })
})

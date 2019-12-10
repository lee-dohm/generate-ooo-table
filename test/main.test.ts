import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

import { generateDates } from '../src/main'

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

describe('generateDates', () => {
  it('creates an array of the proper dates', () => {
    const dates = generateDates('2019-12-08', 'YYYY-MM-DD')

    expect(dates).toStrictEqual([
      '2019-12-08',
      '2019-12-09',
      '2019-12-10',
      '2019-12-11',
      '2019-12-12',
      '2019-12-13',
      '2019-12-14'
    ])
  })
})

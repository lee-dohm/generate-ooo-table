import nock from 'nock'

import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'
import * as util from 'util'

import { generateDates, getTeamMembers, run } from '../src/main'

const readFile = util.promisify(fs.readFile)

const teamName = 'test-org/test-team'
const token = '1234567890abcdef'

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

describe('getTeamMembers', () => {
  beforeEach(() => {
    nock('https://api.github.com')
      .get('/orgs/test-org/teams/test-team')
      .reply(200, { id: 1234 })
      .get('/teams/1234/members')
      .reply(200, [{ login: 'octocat' }, { login: 'lee-dohm' }])
  })

  it('gets the list of team members', async () => {
    const members = await getTeamMembers(token, teamName)

    expect(members).toStrictEqual(['lee-dohm', 'octocat'])
  })
})

describe('run', () => {
  beforeEach(() => {
    nock('https://api.github.com')
      .get('/orgs/test-org/teams/test-team')
      .reply(200, { id: 1234 })
      .get('/teams/1234/members')
      .reply(200, [{ login: 'octocat' }, { login: 'lee-dohm' }])
  })

  afterEach(() => {
    if (fs.existsSync('./ooo-table.json')) {
      fs.unlinkSync('./ooo-table.json')
    }
  })

  it('runs with basic inputs', async () => {
    process.env['INPUT_TEAMNAME'] = teamName
    process.env['INPUT_TOKEN'] = token
    process.env['INPUT_STARTDATE'] = '2019-12-08'

    await run()

    const output = JSON.parse(await readFile('./ooo-table.json', 'utf8'))

    expect(output).toStrictEqual({
      data: [
        [
          '',
          'Sun 12.08',
          'Mon 12.09',
          'Tue 12.10',
          'Wed 12.11',
          'Thu 12.12',
          'Fri 12.13',
          'Sat 12.14'
        ],
        ['@lee-dohm', '', '', '', '', '', '', ''],
        ['@octocat', '', '', '', '', '', '', '']
      ]
    })
  })
})

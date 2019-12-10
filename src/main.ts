import * as path from 'path'

import * as core from '@actions/core'

const moment = require('moment')

export function generateDates(startDate: string, dateFormat: string): string[] {
  return [0, 1, 2, 3, 4, 5, 6]
    .map(days => moment(startDate).add(days, 'days'))
    .map(date => date.format(dateFormat))
}

async function run(): Promise<void> {
  try {
    const dateFormat = core.getInput('dateFormat') || 'ddd MM.DD'
    core.debug(`Date format: ${dateFormat}`)

    const outputPath =
      core.getInput('outputPath') ||
      path.join(process.env['GITHUB_WORKSPACE'] || '.', 'ooo-table.json')
    core.debug(`Output path: ${outputPath}`)

    const startDate = core.getInput('startDate') || moment().format('YYYY-MM-DD')
    core.debug(`Start date: ${startDate}`)

    const teamName = core.getInput('teamName')

    if (!teamName) {
      throw new Error('Team name is a required input')
    }

    core.debug(`Team name: ${teamName}`)

    const token = core.getInput('token')

    if (!token) {
      throw new Error('Token is a required input')
    }

    core.setOutput('outputPath', outputPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

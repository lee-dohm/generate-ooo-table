import * as path from 'path'

import * as core from '@actions/core'

const moment = require('moment')

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

import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

import * as core from '@actions/core'
import * as github from '@actions/github'

const moment = require('moment')
const writeFile = util.promisify(fs.writeFile)

interface Team {
  org: string
  team_slug: string
}

function buildTable(dates: string[], teamMembers: string[]): string[][] {
  const table: string[][] = [['', ...dates]]

  for (const member of teamMembers) {
    table.push([`@${member}`, '', '', '', '', '', '', ''])
  }

  return table
}

export function generateDates(startDate: string, dateFormat: string): string[] {
  return [0, 1, 2, 3, 4, 5, 6]
    .map(days => moment(startDate).add(days, 'days'))
    .map(date => date.format(dateFormat))
}

export async function getTeamMembers(token: string, teamName: string): Promise<string[]> {
  const octokit = new github.GitHub(token)
  const { data: teamData } = await octokit.teams.getByName(splitTeamName(teamName))
  const { data: data } = await octokit.teams.listMembers({ team_id: teamData.id })

  return data.map(member => member.login).sort((a, b) => (a < b ? -1 : 1))
}

function splitTeamName(teamName: string): Team {
  const matches = teamName.match(/@?([^/]+)\/(.+)/)

  if (!matches) {
    throw new Error(`Improperly formatted team name: ${teamName}`)
  }

  return { org: matches[1], team_slug: matches[2] }
}

export async function run(): Promise<void> {
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

    const dates = generateDates(startDate, dateFormat)
    const members = await getTeamMembers(token, teamName)
    const table = buildTable(dates, members)

    await writeFile(outputPath, JSON.stringify({ data: table }))

    core.setOutput('outputPath', outputPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

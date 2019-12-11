# Generate OOO Table Action

A GitHub Action to generate the data for an out-of-office table of team members in a weekly status issue.

## Use

Given a team name and a start date, this Action will create a table that can be used with [lee-dohm/generate-markdown-table](https://github.com/lee-dohm/generate-markdown-table) to create a table that team members can use to report their availability in a weekly status issue.

Example generated JSON:

```javascript
{
  data: [
    ['', 'Sun 12.08', 'Mon 12.09', 'Tue 12.10', 'Wed 12.11', 'Thu 12.12', 'Fri 12.13', 'Sat 12.14'],
    ['@lee-dohm', '', '', '', '', '', '', ''],
    ['@octocat', '', '', '', '', '', '', '']
  ]
}
```

Markdown after processing by lee-dohm/generate-markdown-table:

```markdown
|           | Sun 12.08 | Mon 12.09 | Tue 12.10 | Wed 12.11 | Thu 12.12 | Fri 12.13 | Sat 12.14 |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| @lee-dohm |           |           |           |           |           |           |           |
| @octocat  |           |           |           |           |           |           |           |
```

### Inputs

* `dateFormat` -- [Moment format string](https://momentjs.com/docs/#/displaying/format/) to use to format the date columns (**default:** `ddd MM.DD`)
* `outputPath` -- Path on disk where the table data is stored in JSON format (**default:** `$GITHUB_WORKSPACE/ooo-table.json`)
* `startDate` -- Date of the first column in `YYYY-MM-DD` format (**default:** today)
* `teamName` **required** -- Name of the team whose members will populate the table
* `token` **required** -- Personal access token to use to retrieve the team members

### Outputs

* `outputPath` -- Path on disk where the table data was stored in JSON format (same as the `outputPath` input value)

## License

[MIT](LICENSE.md)

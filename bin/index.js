#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import path from 'node:path'
import fs from 'node:fs'
import { compileFromFile } from 'json-schema-to-typescript'

const options = yargs(hideBin(process.argv))
  .option('i', {
    alias: 'inputDir',
    describe: 'Input directory',
    type: 'string',
    demandOption: true,
  })
  .option('o', {
    alias: 'outputDir',
    describe: 'Output directory',
    type: 'string',
    demandOption: true,
  })
  .help(true).argv

const schemaPath = path.resolve(process.cwd(), options.inputDir)
const typesPath = path.resolve(process.cwd(), options.outputDir)

fs.readdir(schemaPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan input directory: ' + err)
    }

    files.forEach(function (file) {
        compileFromFile(path.join(schemaPath, file)).then((ts) =>
            fs.writeFileSync(path.join(typesPath, `${path.parse(file).name}.d.ts`), ts)
        )
    })
})

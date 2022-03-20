import { name, description, version } from '../package.json'
import { program } from 'commander'

program
  .name(name)
  .description(description)
  .version(version)

program.parse()

console.log(program.opts())

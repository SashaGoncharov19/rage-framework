import yargs from 'yargs'

import create from './commands/create'
import { checkForUpdate } from './utils/update'

yargs.middleware(checkForUpdate)

yargs
    .usage('<cmd> [args]')
    // .scriptName('rage-fw')
    //     .usage('$0 <cmd> [args]')
    // @ts-ignore
    .command(create)
    .help().argv

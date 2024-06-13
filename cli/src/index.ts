import yargs from 'yargs'

import create from './commands/create'

yargs
    .usage('<cmd> [args]')
    // .scriptName('rage-fw')
    //     .usage('$0 <cmd> [args]')
    .command(create)
    .help().argv

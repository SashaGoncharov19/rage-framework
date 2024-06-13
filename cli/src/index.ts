import yargs from 'yargs'

import create from './commands/create'

yargs
    .usage('<cmd> [args]')
    // .scriptName('rage-fw')
    //     .usage('$0 <cmd> [args]')
    // @ts-ignore
    .command(create)
    .help().argv

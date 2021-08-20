#!/usr/bin/env node
const { existsSync, writeFileSync } = require( 'fs' );
const { resolve } = require('path');

const errLog = () => {
    console.error( 'node-bump: ', [...arguments] );
}

const projectPackage = resolve( process.cwd(), 'package.json' );

if ( ! existsSync( projectPackage ) ) {
    errLog( 'no package.json found' );
    return;
}

const package = require( projectPackage );
let [ major, minor, patch ] = package.version.split('.');
const [,,versionLabel] = process.argv;

const output = {
    from: package.version,
    to: null
};

switch( versionLabel ) {
    case 'set':
        [,,,manualVersion] = process.argv;
        [ major, minor, patch ] = manualVersion.split('.');
        break;
    case 'major':
        major++;
        minor = 0;
        patch = 0;
        break;
    case 'minor':
        minor++;
        patch = 0;
        break;
    default:
        patch++;
}

package.version = [ major, minor, patch ].join( '.' ).toString();

output.to = package.version;

writeFileSync( projectPackage, JSON.stringify( package, null, 2 ), { encoding: 'utf-8'} );

console.log( output );
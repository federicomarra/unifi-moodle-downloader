const logger = require('./logging').createConsoleLogger('PathD');
const {existsSync, readFileSync} = require("fs");
const path = require('path');
const yaml= require('yaml');

/**
 * @return {{ pathD: String }}
 */
const pathD = (() => {
  let pathD;
  let localPathD = false;
  if (existsSync(path.resolve(__dirname, '../path.local.yaml'))) {
    logger.info('Trovata configurazione percorso locale, carico "path.local.yaml".');
    localPathD = true;
  } else if (existsSync(path.resolve(__dirname, '../path.yaml'))) {
    logger.info('Configurazione percorso locale non trovata, carico "path.yaml".');
  } else {
    throw 'Nessun file "path.local.yaml" o "path.yaml" trovato!';
  }
  pathD = yaml.parse(readFileSync(path.resolve(__dirname, localPathD ? '../path.local.yaml' : '../path.yaml'), 'utf-8'));
  return pathD;
})();


/**
 * Loads and parses the path file.
 * @return {{ pathD: String }}
 */
async function load() {
  if (process.env.hasOwnProperty("PATH")) {
    //logger.info('Usata variabile d\'ambiente '+ pathD['path'] +'.');
    pathD['path'] = process.env['PATH'].toString();
  }

  await checkPath();
  return pathD;
}

async function checkPath() {
  if (!pathD.path)
    throw 'Non hai configurato il path.';
}

module.exports = {
  load: load
};

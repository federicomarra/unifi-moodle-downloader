const logger = require('./logging').createConsoleLogger('Config');
const {existsSync, readFileSync} = require("fs");
const path = require('path');
const yaml = require('yaml');

/**
 * Loads and parses the config file.
 * @return {{ courseIDs: String[] }}
 */
const config = (() => {
  let config;
  let localConfig = false;
  if (existsSync(path.resolve(__dirname, '../config.local.yaml'))) {
    logger.info('Trovata configurazione locale, carico "config.local.yaml".');
    localConfig = true;
  } else if (existsSync(path.resolve(__dirname, '../config.yaml'))) {
    logger.info('Configurazione locale non trovata, carico "config.yaml".');
  } else {
    throw 'Nessun file "config.local.yaml" o "config.yaml" trovato!';
  }
  config = yaml.parse(readFileSync(path.resolve(__dirname, localConfig ? '../config.local.yaml' : '../config.yaml'), 'utf-8'));
  return config;
})();

const pathDownload = (() => {
  let pathDownload;
  let localConfigPath = false;
  if (existsSync(path.resolve(__dirname, '../path.local.yaml'))) {
    logger.info('Trovata configurazione percorso locale, carico "path.local.yaml".');
    localConfigPath = true;
  } else if (existsSync(path.resolve(__dirname, '../path.yaml'))) {
    logger.info('Configurazione percorso locale non trovata, carico "path.yaml".');
  } else {
    throw 'Nessun file "path.local.yaml" o "path.yaml" trovato!';
  }
  pathDownload = yaml.parse(readFileSync(path.resolve(__dirname, localConfigPath ? '../path.local.yaml' : '../path.yaml'), 'utf-8'));
  return pathDownload;
})();


/**
 * Invoked after the module's top IIFE, overrides loaded configs with env vars.
 * @return {{ courseIDs: String[] }}
 */
async function load() {
  if (process.env.hasOwnProperty("COURSE_IDS")) {
    logger.info('Usata variabile d\'ambiente COURSE_IDS.');
    config['courseIDs'] = process.env['COURSE_IDS'].toString().split(',');
  }

  await checkConfig();
  return config;
}

async function loadPath() {
  if (process.env.hasOwnProperty("PATH")) {
    logger.info('Usata variabile d\'ambiente PATH.');
    pathDownload['path'] = process.env['PATH'];
  }

  await checkConfig();
  return pathDownload;
}

async function checkConfig() {
  if (!["internal", "aria2"].includes(config.downloader)) {
    throw 'Hai impostato un downloader sconosciuto.';
  }
  if (!config.courseIDs) {
    throw 'Non hai configurato gli ID dei corsi.';
  }
  if (!config.courseIDs.length) {
    throw 'Non hai configurato correttamente gli ID dei corsi.';
  }
  for (const id of config.courseIDs) {
    if (typeof id !== 'number' && isNaN(id)) {
      throw 'Non hai configurato correttamente gli ID dei corsi.';
    }
  }
  if (!pathDownload.path) {
    throw 'Non hai configurato il tuo percorso.';
  }
}

module.exports = {
  load: load
};

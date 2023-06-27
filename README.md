# unifi-moodle-downloader

Crawler e downloader di risorse per i corsi Moodle dell'_Università degli Studi di Firenze_.

## Quick start

1. ```bash
   npm install
   ```
2. _(Opzionale)_ Crea una copia di [`config.yaml`](config.yaml) chiamata `config.local.yaml`.
3. Aggiungi gli ID dei tuoi corsi in [`config.local.yaml`](config.local.yaml) (o [`config.yaml`](config.yaml) se
   hai saltato lo step 2)..
   Imponi i corsi nella sezione `coursesIDs` come tupla `[id, nome_corso]`:
   ```yaml
   courseIDs:
   - 30925    # Ricerca Operativa A.A.2022-2023
   ```
    >    **Nota:** gli ID dei corsi sono disponibili nella barra di ricerca di Moodle, ad esempio:
        `https://moodle.unifi.it/course/view.php?id=30925` -> `30925`
4. _(Opzionale)_ Crea una copia di [`secrets.yaml`](secrets.yaml) chiamata `secrets.local.yaml`.
5. Imposta le tue credenziali Moodle in [`secrets.local.yaml`](secrets.local.yaml) (o [`secrets.yaml`](secrets.yaml) se
   hai saltato lo step 4).
    >    **Nota:** le credenziali sono necessarie per accedere ai corsi privati.
<!--
6. _(Opzionale)_ Crea una copia di [`path.yaml`](path.yaml) chiamata `path.local.yaml`.
7. Imposta il tuo path (percorso) in [`path.local.yaml`](path.local.yaml) (o [`path.yaml`](path.yaml) se hai saltato lo
   step 5). Altrimenti i file saranno scaricati ed organizzati nella cartella [`moodle-downloads`](moodle-downloads) nella cartella del progetto.
-->

6. ```bash
   npm start
   ```

## Problemi noti

I file caricati come allegati delle sezioni dei corsi vengono scaricati con i propri nome ed estensione, ma ciò non è
ugualmente possibile per i file linkati direttamente nelle descrizioni delle sezioni: per questi ultimi non è garantità
l'unicità del filename e vengono perciò rinominati con un prefisso incrementale: `[ALT#n] - {nome_del_file}.{ext}`.

## Downloaders alternativi

In caso di problemi con il downloader integrato (carico eccessivo della piattaforma Moodle, problemi di encoding...) è
possibile impostare nel file `config.yaml` `downloader: aria2`.

In questo modo i file non verranno scaricati direttamente ma verrà invece creato un file `aria2c_input.txt` che potrà
essere passato ad [`aria2`](https://aria2.github.io/) per il download parallelo:
> `aria2c -x 16 -j 16 -c -i ./aria2c_input.txt`

## Pulizia dei file estranei

Nel corso del tempo le sezioni interne dei corsi Moodle potrebbero subire delle modifiche o essere riordinate, portando
a nuovi scaricamenti di materiale già esistente.

Lo script [`cleanup_paths.sh`](cleanup_paths.sh) è in grado di eliminare localmente i documenti che su Moodle non
esistono più o sono stati spostati, ma data l'imprevedibilità di questi cambiamenti **è sconsigliato eseguirlo
direttamente**. Per garantire la massima integrità dei dati locali ed evitare la perdita di materiale potenzialmente
importante ma non più disponibile online è preferibile eseguire manualmente i comandi contenuti nello script verificando
ed adattando l'output di ognuno.

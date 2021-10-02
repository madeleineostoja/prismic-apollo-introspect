#!/usr/bin/env node
import fetch from 'node-fetch';
import { program } from 'commander';
import symbols from 'log-symbols';
import fs from 'fs';

program
  .option('-r, --repo <repoId>', 'prismic repository ID')
  .option('-o, --out <path>', 'Path to output file')
  .parse();

const { repo, out } = program.opts();
const token = process.env.PRISMIC_TOKEN;

let prismicApi = `https://${repo}.cdn.prismic.io/api`,
  fragmentsQuery = `https://${repo}.cdn.prismic.io/graphql?query=%7B%20__schema%20%7B%20types%20%7B%20kind%20name%20possibleTypes%20%7B%20name%20%7D%20%7D%20%7D%20%7D`,
  headers = {};

if (token) {
  prismicApi += `?access_token=${token}`;
  headers['authorization'] = `Token ${token}`;
}

async function generateFragmentTypes() {
  const api = await fetch(prismicApi).then((result) => result.json()),
    ref = api.refs.find((r) => r.id === 'master');

  if (!ref) {
    return;
  }

  headers['prismic-ref'] = ref.ref;

  const result = await fetch(fragmentsQuery, { headers })
    .then((result) => result.json());

  const filteredData = result.data.__schema.types.filter(
    (type) => type.possibleTypes !== null
  );

  result.data.__schema.types = filteredData;
  try {
    fs.writeFileSync(out, JSON.stringify(result.data, null, 2));
    console.log(symbols.success, 'Generate fragment types');
  } catch (err) {
    console.error(symbols.error, 'Error writing file', err);
  }
}

generateFragmentTypes();

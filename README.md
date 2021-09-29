# Prismic Apollo Introspect

[![NPM](https://img.shields.io/npm/v/prismic-apollo-introspect)](https://www.npmjs.com/package/prismic-apollo-introspect) [![License](https://img.shields.io/npm/l/prismic-apollo-introspect)](https://github.com/madeleineostoja/prismic-apollo-introspect/blob/master/LICENSE.md)

Utility for automatically generating [Prismic fragment types needed for Apollo](https://prismic.io/docs/technologies/introspection-fragment-matching-with-graphql). Without providing introspection fragment matching to Apollo with Prismic, you won't be able to infer Prismic slice fragments.

## Usage

```sh
npm i prismic-apollo-introspect
```

Run the cli utility, providing your Prismic repo ID and the full path to the generated fragment types JSON file, which you'll pass to Apollo's `IntrospectionFragmentMatcher`.

```sh
prismic-apollo-introspect --repo <repoId> --out <path>
```

Once you've run the utility, pass your generated fragment types to Apollo

```js
import { PrismicLink } from 'apollo-link-prismic';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import Apollo from 'apollo-client';
import fragmentTypes from '<path-to-generated-fragment-types>';

const prismicApi = 'https://your-repo-name.cdn.prismic.io/graphql';

export const client = new Apollo({
  link: PrismicLink({ uri: prismicApi }),
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: fragmentTypes,
    }),
  }),
});
```

You should re-run the introspection generator every time your content model changes, to make it easier you can automatically run it in a `pre` npm script to your development script, which will run every time you run develop.

```json
{
  "scripts": {
    "predevelop": "prismic-apollo-introspect --repo <repoId> --out <path>",
    "develop": "..."
  }
}
```

## Private repos

If your Prismic repo requires an access token, set a `PRISMIC_TOKEN` environment variable. The utility will use it to connect to your repo.

You can set the environment variable in three ways:

## Manually

```sh
PRISMIC_TOKEN=XXXX prismic-apollo-introspect --repo <repoId> --out <path>
```

## In your `.bash_profile/.bashrc/.zshrc`

A more permanent (and secure) way to set the environment variable is in your Bash/Zsh config file.

```sh
export PRISMIC_TOKEN="XXXX"
```

## In an `.env` file

If you need to set several environment variables for several projects, an [`.env`](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs) file at the root of your project file is a convenient way to manage them. To pass `.env` variables to this utility, use the [`env-cmd` NPM package](https://github.com/toddbluhm/env-cmd):

Install the package:

```sh
npm i -D env-cmd
```

Then prepend it to your NPM script:

```js
{
  "scripts": {
    "predevelop": "env-cmd prismic-apollo-introspect --repo <repoId> --out <path>",
    "develop": "..."
  }
}
```

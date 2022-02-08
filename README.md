# prettylus

Seamlessly format Vue SFCs that use Stylus.

## Features

Formats `.vue` single file components, where [Prettier](https://prettier.io) is used for `<template>` an `<script>` tags, while [Manta’s Stylus Supremacy](https://thisismanta.github.io/stylus-supremacy) is used specifically for `<style lang="stylus">`.
Prettier is installed alongside `@prettier/plugin-pug` so that you can use `<template lang="pug">` templates.

## Requirements

- You need to define a [Prettier configuration file](https://prettier.io/docs/en/configuration.html), such as `.prettierrc`, in your project, to configure Prettier.
- You can also define specific formatting rules for Pug in you Prettier configuration file (see [@prettier/plugin-pug](https://github.com/prettier/plugin-pug)).
- Stylus Supremacy is configured using a dedicated file `.stylusrc`. The name of this file is configurable, see below. See [Stylus Supremacy formatting options](https://thisismanta.github.io/stylus-supremacy/#options) for the list of available options.

## Extension Settings

This extension contributes the following settings:

* `prettylus.stylusSupremacyConfigFileName`:  Name of the config file to be used by Stylus Supremacy. Default is `.stylusrc`.

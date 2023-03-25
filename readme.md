# Jekyll Starter Template

A basic Jekyll installation with some sensible config flags.

Set up to use Bootstrap and be deployed using GitHub Pages and/or Netlify. GH Pages and Netlify handle the bundle install directories differently so they're included in the `load_paths` sass flag in `_config.yml`.

## Installation

This has been tested to work on macOS or Ubuntu. Other Linux systems should 'just work'. Requires Ruby and Bundler as per (https://jekyllrb.com/docs/)[Jekyll's specification]

Tell Bundler where to install the dependencies:
`bundle config set path 'vendor/bundle'`

Install the dependencies
`bundle install`

Run Jekyll
`bundle exec jekyll server`
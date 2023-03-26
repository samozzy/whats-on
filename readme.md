# Paradise Green What's On

Made using Jekyll and Bootstrap.

Set up to be deployed with GitHub Pages, Netlify, or Docker. All of which have different ways of configuring bundler directories, so each are included in the the `load_paths` sass flag in `_config.yml`.

# Local Installation

## Bundler 

This has been tested to work on macOS or Ubuntu. Other Linux systems should 'just work'. Requires Ruby and Bundler as per (https://jekyllrb.com/docs/)[Jekyll's specification]

Tell Bundler where to install the dependencies:
`bundle config set path 'vendor/bundle'`

Install the dependencies
`bundle install`

Run Jekyll
`bundle exec jekyll server`

## Docker

With Docker installed, run:
`docker-compose up`

And it should 'just work'. This has only been tested on macOS.

## Viewing

In either case, open your web browser to `localhost:4000` to view the site locally.
## Spread demo - Bayesian propositional querying

### Installation & Requirements

- Install Rust Nightly (`rustup toolchain install nightly-2018-02-07`, [Install Rustup](https://www.rust-lang.org/en-US/install.html))
- Install `cargo-web`: `cargo +nightly install cargo-web --vers 0.6.8`
- Clone the repository
- `git submodule init vendor/bay && git submodule update`
- `npm install`

### Running

In seperate console windows run:
- `npm run server`
- `npm run watch:cargo`
- `npm run watch:webpack`

Once everything is built, the demo should be available under: <http://localhost:3000/graph.html>

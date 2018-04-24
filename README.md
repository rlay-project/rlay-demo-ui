## Spread demo - Bayesian propositional querying

### Installation & Requirements

- Install Rust Nightly (`rustup toolchain install nightly-2018-02-07`, [Install Rustup](https://www.rust-lang.org/en-US/install.html))
- Install `cargo-web`: `cargo +nightly install cargo-web --vers 0.6.8`
- Clone the repository
- `git submodule init vendor/bay && git submodule update`
- `npm install`

### Running

Run a testnet with deployed contracts as outlined in the README of [spread-protocol](https://github.com/spread-foundation/spread-protocol).

Run `npm run seed` to seed demo data.

In seperate console windows run continously:
- `npm run server`
- `npm run watch:cargo`
- `npm run watch:webpack`

Once everything is built, the demo should be available under: <http://localhost:3000>

Link with inline wallet: <http://localhost:3000/#pk=0x1c1a965a9fb6beb254bafa72588797b0268f43783cffbfa41659f47ae77a3529>

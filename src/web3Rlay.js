/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

// Extend web3 0.20.x with custom Rlay RPC methods.
const extendWeb3OldWithRlay = web3 => {
  web3._extend({
    property: 'rlay',
    methods: [
      new web3._extend.Method({
        name: 'version',
        call: 'rlay_version',
      }),
      new web3._extend.Method({
        name: 'getPropositionPools',
        call: 'rlay_getPropositionPools',
        outputFormatter: pools => {
          const formattedPools = pools.map(pool => {
            pool.totalWeight = web3.toBigNumber(pool.totalWeight);
            pool.values = pool.values.map(value => {
              value.totalWeight = web3.toBigNumber(value.totalWeight);

              return value;
            });

            return pool;
          });
          return formattedPools;
        },
      }),
    ],
  });
};

module.exports = {
  extendWeb3OldWithRlay,
};

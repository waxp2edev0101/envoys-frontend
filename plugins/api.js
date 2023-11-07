export default ({ app }, inject) => {
  app.$api = {
    index: {
      getStatistic: '/v2/index/get-statistic',
      getMarkets: '/v2/index/get-markets'
    },
    auth: {
      actionSignup: '/v2/auth/action-signup',
      actionSignin: '/v2/auth/action-signin',
      actionReset: '/v2/auth/action-reset',
      setLogout: '/v2/auth/set-logout',
      getRefresh: '/v2/auth/get-refresh',
      getSecure: '/v2/auth/get-secure'
    },
    account: {
      getUser: '/v2/account/get-user',
      setUser: '/v2/account/set-user',
      getActions: '/v2/account/get-actions',
      getFactor: '/v2/account/get-factor',
      setFactor: '/v2/account/set-factor',
    },
    kyc: {
      setProcess: '/v2/verification/set-process',
      setCanceled: '/v2/verification/set-canceled',
      getStatus: '/v2/verification/get-status',
      getPrivilege: '/v2/verification/get-privilege',
      getApplicant: '/v2/verification/get-applicant'
    },
    ohlcv: {
      getTicker: '/v2/ohlcv/get-ticker'
    },
    provider: {
      getPrice: '/v2/provider/get-price',
      getSymbol: '/v2/provider/get-symbol',
      getMarkers: '/v2/provider/get-markers',
      getTrades: '/v2/provider/get-trades',
      getPairs: '/v2/provider/get-pairs',
      getPair: '/v2/provider/get-pair',
      getOrders: '/v2/provider/get-orders',
      getAsset: '/v2/provider/get-asset',
      getAssets: '/v2/provider/get-assets',
      setAsset: '/v2/provider/set-asset',
      setOrder: '/v2/provider/set-order',
      cancelOrder: '/v2/provider/cancel-order',
      setWithdraw: '/v2/provider/set-withdraw',
      cancelWithdraw: '/v2/provider/cancel-withdraw',
      getTransactions: '/v2/provider/get-transactions',
      getTicker: '/v2/provider/get-ticker'
    },
    future: {
      setOrder: '/v2/future/set-order',
      getOrders: '/v2/future/get-orders',
    },
    stock: {
      setAgent: '/v2/stock/set-agent',
      getAgent: '/v2/stock/get-agent',
      deleteAgent: '/v2/stock/delete-agent',
      getBroker: '/v2/stock/get-brokers',
      setBrokerAsset: '/v2/stock/broker/set-asset',
      getRequests: '/v2/stock/get-requests',
      getAgents: '/v2/stock/get-agents',
      setSetting: '/v2/stock/request/set-setting',
      setBlocked: '/v2/stock/agent/set-blocked',
      getAssets: '/v2/stock/get-assets',
      getAsset: '/v2/stock/get-asset',
      setAsset: '/v2/stock/set-asset',
      setWithdraw: '/v2/stock/set-withdraw',
      getWithdraws: '/v2/stock/get-withdraws',
      cancelWithdraw: '/v2/stock/cancel-withdraw',
      getPair: '/v2/stock/get-pair',
      getPairs: '/v2/stock/get-pairs',
      getPrice: '/v2/stock/get-price',
      cancelOrder: '/v2/stock/cancel-order',
      getOrders: '/v2/stock/get-orders',
      setOrder: '/v2/stock/set-order'
    },
    ads: {
      getAdvertisements: '/v2/ads-shot/get-advertisements',
      getAdvertising: '/v2/ads-shot/get-advertising'
    },
    admin: {
      spot: {
        setAsset: '/v1/admin/spot/set-asset',
        getAsset: '/v1/admin/spot/get-asset',
        getAssets: '/v1/admin/spot/get-assets',
        deleteAsset: '/v1/admin/spot/delete-asset',
        getChains: '/v1/admin/spot/get-chains',
        getChain: '/v1/admin/spot/get-chain',
        setChain: '/v1/admin/spot/set-chain',
        deleteChain: '/v1/admin/spot/delete-chain',
        getPairs: '/v1/admin/spot/get-pairs',
        getPair: '/v1/admin/spot/get-pair',
        setPair: '/v1/admin/spot/set-pair',
        deletePair: '/v1/admin/spot/delete-pair',
        getMarketPrice: '/v1/admin/spot/get-market-price',
        getContracts: '/v1/admin/spot/get-contracts',
        getContract: '/v1/admin/spot/get-contract',
        setContract: '/v1/admin/spot/set-contract',
        deleteContract: '/v1/admin/spot/delete-contract',
        getTransactions: '/v1/admin/spot/get-transactions',
        getBalances: '/v1/admin/spot/get-balances',
        getReserves: '/v1/admin/spot/get-reserves',
        setReserveUnlock: '/v1/admin/spot/set-reserve-unlock',
        getRepayments: '/v1/admin/spot/get-repayments',
        setRepayment: '/v1/admin/spot/set-repayment'
      },
      account: {
        getAccounts: '/v1/admin/account/get-accounts',
        getAccount: '/v1/admin/account/get-account',
        setAccount: '/v1/admin/account/set-account',
        getKycApplicant: '/v1/admin/account/get-kyc-applicant'
      },
      ads: {
        setAdvertising: '/v1/admin/ads-shot/set-advertising',
        deleteAdvertising: '/v1/admin/ads-shot/delete-advertising'
      }
    },
    status: '/v2/status',
    timestamp: '/v2/timestamp',
  };
  inject('api', app.$api);
};
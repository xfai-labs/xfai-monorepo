/* eslint-disable */
const locale = {
  // SWAP
  Swap: {
    PageInfo: {
      TITLE: 'Swap Tokens',
      HIGHLIGHT_TITLE: 'Swap',
      DESCRIPTION: 'Swap any token with any other token.',
      DOCUMENTATION_BUTTON: 'How to swap',
    },

    Tooltip: {
      TOOLTIP: undefined, // Set as undefined to remove tooltip (Will remove them from localization file after)
    },

    Label: {
      SWAP: 'Swap',
      SWAP_TOKENS: 'Swap Tokens',
      SWAPPING_TOKENS: 'Swapping Tokens',
      SWAP_SUCCESSFUL: 'Swap Successful',
      SWAP_FAILED: 'Swap Failed',
      SWAPPING_FROM: 'Swapping from',
      SWAPPING_TO: 'Swapping to',
      RATE: 'Rate',
    },

    Button: {
      SWAP: 'Swap',
    },
  },

  // INFINITY STAKE
  InfinityStake: {
    PageInfo: {
      TITLE: 'Infinity Staking',
      HIGHLIGHT_TITLE: 'Staking',
      DESCRIPTION: 'The staked amount will be permanently locked.',
      DOCUMENTATION_BUTTON: 'How to stake',
    },

    Tooltip: {
      ESTIMATED_APR:
        'The estimated APR for the specified amount. This value changes depending on DEX usage.',
      INFINITY_STAKING: 'The amount of tokens to permanently lock in exchange for an Infinity NFT.',
      TOTAL_XFIT: 'The total amount of XFIT that will be permanently locked for the provided', // Append token symbol
    },

    Message: {
      AMOUNT_WILL_BE_PERMANENTLY_LOCKED: 'This amount will be permanently locked.',
    },

    Label: {
      INFINITY_STAKING: 'Infinity Staking',
      STAKING: 'Staking',
      INFINITY_STAKE_SUCCESSFUL: 'Infinity Stake Successful',
      STAKE_FAILED: 'Stake Failed',
      ESTIMATED_APR: 'Estimated APR',
      TOTAL_XFIT: 'Total XFIT',
    },

    Button: {
      STAKE: 'Stake', // Prepend Infinity Symbol
    },
  },

  // INFT BOOST
  Boost: {
    PageInfo: {
      TITLE: 'Boost INFT',
      HIGHLIGHT_TITLE: 'Boost',
    },

    Label: {
      BOOST_INFT: 'Boost INFT',
      BOOSTING_INFT: 'Boosting INFT',
      INFT_BOOST_SUCCESSFUL: 'INFT Boost Successful',
      INFT_BOOST_FAILED: 'INFT Boost Failed',
      BOOST_AMOUNT: 'Boost Amount',
      BOOSTED_AMOUNT: 'Boosted Amount',
    },

    Button: {
      BOOST: 'Boost',
    },
  },

  // LIQUIDITY
  Liquidity: {
    Add: {
      PageInfo: {
        TITLE: 'Add Liquidity',
        HIGHLIGHT_TITLE: 'Liquidity',
        DESCRIPTION: 'Provide liquidity to any pool.',
        DOCUMENTATION_BUTTON: 'How to provide liquidity',
      },

      Tooltip: {
        SELECT_PRIMARY_TOKEN: 'The pool where the liquidity tokens will be minted from.',
        SELECT_SECONDARY_TOKEN: 'The secondary pool required for liquidity provisioning.',
        YOUR_TOTAL_LIQUIDITY:
          'The USD value of the liquidity tokens. Liquidity tokens accumulate protocol fees.',
        POOL_SHARE: 'The pool share of the liquidity tokens that will be minted.',
        TOTAL_VALUE_LOCKED: 'The usd value locked in the pool',
      },

      Label: {
        SELECT_PRIMARY_TOKEN: 'Select Primary Token',
        SELECT_SECONDARY_TOKEN: 'Select Secondary Token',
        PRIMARY_TOKEN_AND_AMOUNT: 'Primary Token & Amount',
        SECONDARY_TOKEN_AND_AMOUNT: 'Secondary Token & Amount',
        YOUR_TOTAL_LIQUIDITY: 'Your Total Liquidity',
        TOTAL_VALUE_LOCKED: 'Total Value Locked (TVL)',

        ADD_LIQUIDITY: 'Add Liquidity',
        ADDING_LIQUIDITY: 'Adding Liquidity',
        LIQUIDITY_ADDED: 'Liquidity Added',
        ADD_LIQUIDITY_FAILED: 'Add Liquidity Failed',
      },

      Button: {
        ADD_LIQUIDITY: 'Add Liquidity',
        MANAGE_LIQUIDITY: 'Manage Liquidity',
      },
    },

    Manage: {
      PageInfo: {
        TITLE: 'Manage Liquidity',
        HIGHLIGHT_TITLE: 'Liquidity',
        DESCRIPTION: 'Manage your liquidity.',
        DOCUMENTATION_BUTTON: 'How to manage liquidity',
      },

      Tooltip: {
        REDEEM_AMOUNT: undefined,
        POOL_SHARE: 'The pool share of the liquidity tokens.',
      },

      Label: {
        PRIMARY_TOKEN_TO_EXIT: 'Primary Token to Exit',
        SECONDARY_TOKEN_TO_EXIT: 'Secondary Token to Exit',
        REDEEM_AMOUNT: 'Redeem Amount',
        NO_LP_ALLOWANCE: 'No LP Token Allowance',

        REDEEM: 'Redeem', // {Liquidity.Manage.Label.REDEEM} {SYMBOL} {Liquidity.Manage.Label.LIQUIDITY}
        REDEEMING: 'Redeeming', // {Liquidity.Manage.Label.REDEEMING} {SYMBOL} {Liquidity.Manage.Label.LIQUIDITY} | {Liquidity.Manage.Label.REDEEMING} {SYMBOL} {Liquidity.Manage.Label.LIQUIDITY} {Label.FAILED}
        REDEEMED: 'Redeemed', // {Liquidity.Manage.Label.REDEEMED} {SYMBOL} {Liquidity.Manage.Label.LIQUIDITY}
        LIQUIDITY: 'Liquidity',
      },

      Button: {
        BACK_TO_ADD_LIQUIDITY: 'Back to Add Liquidity',
        MANAGE: 'Manage',
        ADD: 'Add', // Append TOKEN_SYMBOL + LIQUIDITY_BUTTON
        LIQUIDITY: 'Liquidity', // Prepend ADD_BUTTON + TOKEN_SYMBOL
        REDEEM: 'Redeem',
        ALLOW_XFAI_TO_USE_YOUR_LIQUIDITY_TOKENS: 'Allow Xfai to use the Liquidity Tokens',
        BLOCK_EXPLORER: 'Block Explorer',
        HIDE_POOL: 'Hide Pool',
      },
    },

    Label: {
      POOL_SHARE: 'Pool Share',
    },
  },

  // INFTs
  INFTs: {
    PageInfo: {
      TITLE: 'Manage INFTs',
      HIGHLIGHT_TITLE: 'INFTs',
      DESCRIPTION: 'Manage your Infinity NFTs.',
      DOCUMENTATION_BUTTON: 'How to manage INFTs',
    },

    Tooltip: {
      CURRENT_ESTIMATED_VALUE:
        'The estimated value of the INFT. This value represents the total sum of fees collected across the top pools.',
      HARVEST_AMOUNT: undefined,
      HARVEST_LEFT:
        'The INFT share percentage left for this pool. Harvesting reduces the pool share.',
      POOL_SHARE: "The INFT's share of the pool.",
      HARVEST_AVAILABILITY:
        'Harvesting INFT Fees is only available for the owner address of the INFT.',
      NO_FEES_TO_HARVEST: 'There are no fees to harvest for this pool.',
    },

    Message: {
      NO_INFTS: 'Looks like you have no INFTs to manage.',
      NO_INFTS_STAKE_OR_IMPORT: 'You can go back to the Infinity Stake.',
      TRANSFER_WARNING:
        'INFT Transfer is not reversible, verify the address is correct before confirming.',
      HARVESTING_REDUCES_POOL_SHARE: "Harvesting reduces the INFT's pool share",
    },

    Label: {
      INFINITY_NFT: 'Infinity NFT', // Infinity NFT #521
      INFTS: 'INFTs',
      CURRENT_ESTIMATED_VALUE: 'Current Estimated Value',
      HARVEST_LEFT: 'Harvest Left',
      POOL_SHARE: 'Pool Share',
      OTHER_POOLS: 'Other Pools',

      TRANSFER_INFT: 'Transfer INFT',
      CONFIRM_INFT_TRANSFER: 'Confirm INFT Transfer',
      TRANSFERRING_INFT: 'Transferring INFT',
      INFT_TRANSFER_SUCCESSFUL: 'INFT Transfer Successful',
      INFT_TRANSFER_FAILED: 'INFT Transfer Failed',

      SAME_OWNER_ERROR: 'Same Owner',

      INCORRECT_FORMAT: 'Incorrect Format',
      YOU_DONT_HAVE_ENOUGH_PERMISSIONS_TO_IMPORT_THIS_INFT:
        "You don't have permissions to import this INFT",

      I_HAVE_READ_THE: 'I have read the',

      HARVEST: 'Harvest', // {Localization.INFTs.Label.HARVEST} {SYMBOL} {Localization.INFTs.Label.FEES} | {SYMBOL} {Localization.INFTs.Label.HARVEST} {Localization.Label.SUCCESSFUL} | {SYMBOL} {Localization.INFTs.Label.HARVEST} {Localization.Label.FAILED}
      HARVESTING: 'Harvesting', // {Localization.INFTs.Label.HARVESTING} {SYMBOL} {Localization.INFTs.Label.FEES}
      FEES: 'Fees',
      HARVEST_AMOUNT: 'Harvest Amount',
    },

    Button: {
      GO_TO_STAKE: 'Go to Stake',
      TRANSFER: 'Transfer',
      HARVEST: 'Harvest',
      PROCEED: 'Proceed',
      BOOST_INFT: 'Boost INFT',
      INFT_HARVEST_GUIDE: 'INFT harvesting guide',
    },
  },

  // Connect Wallet
  Connect: {
    PageInfo: {
      TITLE: 'Connect Wallet',
      DESCRIPTION: 'Connect your wallet to use the Xfai DEX.',
      DOCUMENTATION_BUTTON: 'How to connect your wallet',
    },

    Button: {
      CONNECT_WALLET: 'Connect Wallet',
    },
  },

  // 404 Not Found
  NotFound: {
    PageInfo: {
      TITLE: 'Not Found',
      SUBTITLE: "The page you were looking for doesn't exist",
    },
  },

  Theme: {
    LIGHT: 'Light',
    DARK: 'Dark',
    SYSTEM: 'System',
  },

  Tooltip: {
    GAS_FEE: undefined,
    SLIPPAGE_TOLERANCE: undefined,
    TOKEN_LISTS: undefined,
    IMPORTED_TOKENS: undefined,
    ALL_POOLS: 'Display all imported pools with or without balance.',
  },

  Message: {
    EXTENDED_LIST_TOKEN_WARNING: 'This token is not in the active token list(s)',
    IMPORT_TOKEN:
      'This token doesn’t appear on the active token list(s). Would you like to add it?',
    WAITING_FOR_CONFIRMATION: 'Waiting For Confirmation.',
    THIS_MAY_TAKE_SOME_TIME: 'This may take some time.',
    TRANSACTION_FAILED_CHECK_DETAILS:
      'Transaction failed, please check the details on Block Explorer.',

    TRANSACTION_REJECTED_BY_USER: 'Transaction rejected by user.',
    INCORRECT_TOKEN_ADDRESS:
      'The address appears to be incorrect, please provide the token address.',
    TOKEN_NOT_ON_XFAI: 'This token is not yet on XFAI, would you like to add it?',
    TOKEN_DOES_NOT_HAVE_POOL:
      'This token does not have a liquidity pool yet, would you like to create it?',
    CONFIRM_TRANSACTION_IN_WALLET: 'Confirm this transaction in your wallet',

    COULD_NOT_ESTIMATE_GAS: 'Could not estimate gas',
    DATA_PROVIDED_BY_COINGECKO: 'Data by CoinGecko',
  },

  Button: {
    LOGOUT: 'Logout',
    CANCEL: 'Cancel',
    CLOSE: 'Close',
    CONFIRM: 'Confirm',
    DONE: 'Done',
    MAX: 'Max',
    DETAILS: 'Details',
    IMPORT: 'Import',
    IMPORT_TOKEN: 'Import Token',
    IMPORT_POOL: 'Import Pool',
    SELECT_TOKEN: 'Select Token',
    SELECT: 'SELECT',
    CREATE_LIQUIDITY_POOL: 'Create Liquidity Pool',
    IMPORT_AND_CREATE_LIQUIDITY_POOL: 'Import Token & Create Pool',
    MANAGE_IMPORTED_TOKENS: 'Manage Imported Token',
    ALLOW_XFAI_TO_USE_YOUR: 'Allow XFAI to use your', // Append Token Symbol
  },

  Label: {
    VERSION: 'Version',
    SWITCH_NETWORK: 'Switch Network',
    CONFIRM_NETWORK_SWITCH: 'Confirm Network Switch',
    UNSUPPORTED_NETWORK: 'Unsupported Network',
    SWITCH_TO_A_SUPPORTED_NETWORK: 'Switch to a supported network',
    YOUR_WALLET: 'Your Wallet',
    WALLET_ADDRESS: 'Wallet Address',
    WALLET_PROVIDER: 'Wallet Provider',
    SETTINGS: 'Settings',
    THEME: 'Theme',
    SELECT_A_TOKEN: 'Select a token',
    POPULAR_TOKENS: 'Popular tokens',
    NO_LIQUIDITY_POOL: 'No Liquidity Pool',
    IMPORT_TOKEN: 'Import Token',
    ALL_POOLS: 'All Pools',
    SLIPPAGE: 'Slippage',
    SLIPPAGE_TOLERANCE: 'Slippage Tolerance',
    LP_SLIPPAGE_TOLERANCE: 'LP Slippage Tolerance',
    GAS_FEE: 'Gas Fee',
    ESTIMATED_GAS_FEE: 'Estimated Gas Fee',
    COULD_NOT_ESTIMATE: "Couldn't estimate",
    SUPPLYING: 'Supplying',
    MANAGE_IMPORTED_TOKENS: 'Manage Imported Tokens',
    TOKEN_LISTS: 'Token Lists',
    IMPORTED_TOKENS: 'Imported Tokens',
    IMPORTED_TOKEN: 'Imported Token',
    SUCCESSFUL: 'Successful',
    FAILED: 'Failed',
    FETCHING_DATA: 'Fetching Data',
    ALLOWANCE: 'ALLOWANCE',
    LOADING: 'Loading',
    CONFIRMING: 'Confirming',
    APPROVED: 'Approved',
    PROCESSING: 'Processing',
    ACCUMULATED_FEES: 'Accumulated Fees',
    LAST_24_HOURS: 'Last 24 Hours',
    LAST_7_DAYS: 'Last 7 Days',
    MAX: 'MAX',
    MAX_GAS: 'Max Gas Price',
    AMOUNT: 'Amount',
  },

  Error: {
    INSUFFICIENT_BALANCE: 'Insufficient Balance',
    INSUFFICIENT_DEX_LIQUIDITY: 'Insufficient DEX Liquidity',
  },
};
/* eslint-enable */

export default locale;

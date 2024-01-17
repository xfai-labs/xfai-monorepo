[**@xfai-labs/sdk**](README.md)

---

# @xfai-labs/sdk

## Enumerations

### AddressType

#### Enumeration Members

| Member    | Value       |
| :-------- | :---------- |
| `Account` | `"account"` |
| `INFT`    | `"inft"`    |
| `Pool`    | `"pool"`    |
| `Token`   | `"token"`   |

---

### TradeType

#### Enumeration Members

| Member         | Value |
| :------------- | :---- |
| `EXACT_INPUT`  | `0`   |
| `EXACT_OUTPUT` | `1`   |

## Classes

### Xfai

This class contains all the information needed to interact with the Xfai protocol.
The provider parameter is used to interact with the Ethereum network using ethers.js.

#### Constructors

##### constructor()

> **new Xfai**(
> `provider`,
> `chain`,
> `swapFee` = `2`): [`Xfai`](README.md#xfai)

###### Parameters

| Parameter  | Type                                                                  | Default value | Description                                                    |
| :--------- | :-------------------------------------------------------------------- | :------------ | :------------------------------------------------------------- |
| `provider` | `StaticJsonRpcProvider` & \{`_hasWallet`: `false`;} \| `Web3Provider` | `undefined`   | The provider to use for interacting with the Ethereum network. |
| `chain`    | [`Chain`](README.md#chain)\< `number` \>                              | `undefined`   | The chain config to use for interacting with the network.      |
| `swapFee`  | `number`                                                              | `2`           | The swap fee                                                   |

###### Returns

[`Xfai`](README.md#xfai)

###### Source

[libs/sdk/src/lib/xfai.ts:76](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai.ts#L76)

#### Properties

| Property                          | Type                                                                  | Description                                                    |
| :-------------------------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------- |
| `chain`                           | [`Chain`](README.md#chain)\< `number` \>                              | The chain config to use for interacting with the network.      |
| `readonly` `coreAddress`          | `string`                                                              | -                                                              |
| `readonly` `factoryAddress`       | `string`                                                              | -                                                              |
| `readonly` `hasWallet`            | `boolean`                                                             | -                                                              |
| `readonly` `inftAddress`          | `string`                                                              | -                                                              |
| `readonly` `inftPeripheryAddress` | `string`                                                              | -                                                              |
| `readonly` `multicallAddress`     | `string`                                                              | -                                                              |
| `readonly` `nativeToken`          | `TokenInfo`                                                           | -                                                              |
| `readonly` `peripheryAddress`     | `string`                                                              | -                                                              |
| `readonly` `poolInitCodeHash`     | `string`                                                              | -                                                              |
| `readonly` `provider`             | `StaticJsonRpcProvider` & \{`_hasWallet`: `false`;} \| `Web3Provider` | The provider to use for interacting with the Ethereum network. |
| `readonly` `swapFee`              | `BigNumberish`                                                        | -                                                              |
| `readonly` `topTokenAddresses`    | `string`[]                                                            | -                                                              |
| `readonly` `underlyingToken`      | `TokenInfo`                                                           | -                                                              |
| `readonly` `usdc`                 | `undefined` \| `TokenInfo`                                            | -                                                              |
| `readonly` `wrappedNativeToken`   | `TokenInfo`                                                           | -                                                              |

## Type Aliases

### AccountAddress

> **AccountAddress**: [`Address`](README.md#address)\< [`Account`](README.md#account) \>

#### Source

[libs/sdk/src/lib/xfai.ts:48](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai.ts#L48)

[libs/sdk/src/lib/xfai.ts:49](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai.ts#L49)

---

### Address

> **Address**: \<`T`\> `object`

#### Type parameters

| Parameter                                            |
| :--------------------------------------------------- |
| `T` _extends_ [`AddressType`](README.md#addresstype) |

#### Type declaration

| Member    | Type     |
| :-------- | :------- |
| `address` | `string` |
| `type`    | `T`      |

#### Source

[libs/sdk/src/lib/xfai.ts:39](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai.ts#L39)

[libs/sdk/src/lib/xfai.ts:43](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai.ts#L43)

---

### BoostOptions

> **BoostOptions**: `Omit`\< [`TransactionOptions`](README.md#transactionoptions), `"slippage"` \>

#### Source

[libs/sdk/src/lib/periphery/inft/boost.ts:7](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/inft/boost.ts#L7)

---

### Chain

> **Chain**: \<`T`\> `object`

#### Type parameters

| Parameter              | Default  |
| :--------------------- | :------- |
| `T` _extends_ `number` | `number` |

#### Type declaration

| Member                          | Type                                                |
| :------------------------------ | :-------------------------------------------------- |
| `readonly` `addresses`          | `object`                                            |
| `addresses.core`                | `string`                                            |
| `addresses.factory`             | `string`                                            |
| `addresses.inft`                | `string`                                            |
| `addresses.inft_periphery`      | `string`                                            |
| `addresses.multicall`           | `string`                                            |
| `addresses.periphery`           | `string`                                            |
| `addresses.pool_hash`           | `string`                                            |
| `addresses.token_usdc`?         | `string`                                            |
| `addresses.underlying_token`    | `string`                                            |
| `backendApi`?                   | `string`                                            |
| `blockExplorerUrl`?             | `string`                                            |
| `readonly` `chainId`            | `T`                                                 |
| `cloudflareApiKey`?             | `string`                                            |
| `readonly` `defaultTokenList`   | `TokenList`                                         |
| `readonly` `development`        | `boolean`                                           |
| `etherscanApi`?                 | `string`                                            |
| `readonly` `label`              | `string`                                            |
| `readonly` `logoUri`            | `string`                                            |
| `readonly` `nativeToken`        | `Omit`\< `TokenInfo`, `"chainId"` \| `"address"` \> |
| `readonly` `rpcUrl`             | `string`                                            |
| `topTokenAddresses`?            | _readonly_ `string`[]                               |
| `readonly` `wrappedNativeToken` | `Omit`\< `TokenInfo`, `"chainId"` \>                |

#### Source

[libs/sdk/src/lib/xfai.ts:6](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai.ts#L6)

---

### INFT

> **INFT**: `object`

#### Type declaration

| Member | Type        |
| :----- | :---------- |
| `id`   | `number`    |
| `type` | `"inft_id"` |

#### Source

[libs/sdk/src/lib/inft/core.ts:5](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L5)

[libs/sdk/src/lib/inft/core.ts:10](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L10)

---

### INFTBalance

> **INFTBalance**: `object`

#### Type declaration

| Member            | Type        |
| :---------------- | :---------- |
| `amount`          | `BigNumber` |
| `harvestedShares` | `BigNumber` |
| `totalShares`     | `BigNumber` |

#### Source

[libs/sdk/src/lib/inft/balance.ts:8](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/balance.ts#L8)

---

### INFTState

> **INFTState**: `object`

#### Type declaration

| Member           | Type        |
| :--------------- | :---------- |
| `initialReserve` | `BigNumber` |
| `reserve`        | `BigNumber` |
| `shares`         | `BigNumber` |

#### Source

[libs/sdk/src/lib/inft/core.ts:26](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L26)

---

### LiquidityInAmount

> **LiquidityInAmount**: \<`P`\> `object`

#### Type parameters

| Parameter                                | Default                    |
| :--------------------------------------- | :------------------------- |
| `P` _extends_ [`Token`](README.md#token) | [`Token`](README.md#token) |

#### Type declaration

| Member   | Type        |
| :------- | :---------- |
| `amount` | `BigNumber` |
| `token`  | `P`         |

#### Source

[libs/sdk/src/lib/periphery/liquidity/add.ts:7](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/liquidity/add.ts#L7)

---

### ParsedEthersError

> **ParsedEthersError**: `object`

#### Type declaration

| Member    | Type                  |
| :-------- | :-------------------- |
| `context` | `ReturnValue`         |
| `error`   | `Error`               |
| `type`    | `"ParsedEthersError"` |

#### Source

[libs/sdk/src/lib/xfai-core.ts:4](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-core.ts#L4)

---

### Pool

> **Pool**: [`Address`](README.md#address)\< [`Pool`](README.md#pool) \>

#### Source

[libs/sdk/src/lib/pool/core.ts:10](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L10)

[libs/sdk/src/lib/pool/core.ts:11](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L11)

---

### PoolState

> **PoolState**: `object`

#### Type declaration

| Member       | Type        |
| :----------- | :---------- |
| `ethReserve` | `BigNumber` |
| `reserve`    | `BigNumber` |

#### Source

[libs/sdk/src/lib/pool/core.ts:18](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L18)

---

### Quote

> **Quote**: \<`T`\> `object`

#### Type parameters

| Parameter                                        |
| :----------------------------------------------- |
| `T` _extends_ [`QuoteBase`](README.md#quotebase) |

#### Type declaration

| Member        | Type                               |
| :------------ | :--------------------------------- |
| `amount`      | `BigNumber`                        |
| `token`       | `object`                           |
| `token.state` | [`PoolState`](README.md#poolstate) |
| `token.token` | [`Token`](README.md#token)         |
| `type`        | `T`                                |

#### Source

[libs/sdk/src/lib/pool/quote.ts:20](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/quote.ts#L20)

---

### QuoteBase

> **QuoteBase**: `"ETH"` \| `"Token"`

#### Source

[libs/sdk/src/lib/pool/quote.ts:6](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/quote.ts#L6)

---

### QuoteResult

> **QuoteResult**: \<`T`\> `T` _extends_ `"Token"` ? \{`ethIn`: `BigNumber`; `tokenIn`: `BigNumber` \| `undefined`; `xfAmount`: `BigNumber`;} : \{`ethIn`: `BigNumber` \| `undefined`; `tokenIn`: `BigNumber`; `xfAmount`: `BigNumber`;}

#### Type parameters

| Parameter                                        |
| :----------------------------------------------- |
| `T` _extends_ [`QuoteBase`](README.md#quotebase) |

#### Source

[libs/sdk/src/lib/pool/quote.ts:8](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/quote.ts#L8)

---

### StakeOptions

> **StakeOptions**: `Omit`\< [`TransactionOptions`](README.md#transactionoptions), `"slippage"` \>

#### Source

[libs/sdk/src/lib/periphery/inft/stake.ts:8](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/inft/stake.ts#L8)

---

### SupportedChainIds

> **SupportedChainIds**: _keyof_ _typeof_ [`Chains`](README.md#chains)

#### Source

[libs/sdk/src/chains/index.ts:11](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/chains/index.ts#L11)

[libs/sdk/src/chains/index.ts:12](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/chains/index.ts#L12)

---

### SwapAmount

> **SwapAmount**: `object`

#### Type declaration

| Member        | Type        |
| :------------ | :---------- |
| `amount`      | `BigNumber` |
| `priceImpact` | `number`    |

#### Source

[libs/sdk/src/lib/pool/swap-amounts.ts:14](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/swap-amounts.ts#L14)

---

### TargetTokenAmount

> **TargetTokenAmount**: `object`

#### Type declaration

| Member          | Type                       |
| :-------------- | :------------------------- |
| `desiredAmount` | `BigNumber`                |
| `token`         | [`Token`](README.md#token) |

#### Source

[libs/sdk/src/lib/periphery/liquidity/remove.ts:7](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/liquidity/remove.ts#L7)

---

### Token

> **Token**: [`Address`](README.md#address)\< [`Token`](README.md#token) \> \| `Pick`\< `TokenInfo`, `"address"` \| `"decimals"` \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:9](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L9)

[libs/sdk/src/lib/xfai-token.ts:11](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L11)

---

### TransactionOptions

> **TransactionOptions**: `object`

#### Type declaration

| Member      | Type                 |
| :---------- | :------------------- |
| `deadline`  | `Date`               |
| `from`      | `Signer`             |
| `gasLimit`? | `BigNumber`          |
| `slippage`  | `BigNumberish`       |
| `to`?       | `Signer` \| `string` |

#### Source

[libs/sdk/src/lib/periphery/core.ts:12](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/core.ts#L12)

## Variables

### BASISPOINT_MAX

> `const` **BASISPOINT_MAX**: `BigNumber`

A utility module for handling basis points and converting them to percentages.

#### Source

[libs/sdk/src/lib/xfai-utils.ts:13](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L13)

---

### Chains

> `const` **Chains**: `object`

#### Type declaration

| Member             | Type                                    |
| :----------------- | :-------------------------------------- |
| `readonly` `5777`  | [`Chain`](README.md#chain)\< `5777` \>  |
| `readonly` `59140` | [`Chain`](README.md#chain)\< `59140` \> |
| `readonly` `59144` | [`Chain`](README.md#chain)\< `59144` \> |

#### Source

[libs/sdk/src/chains/index.ts:6](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/chains/index.ts#L6)

---

### Mainnet

> `const` **Mainnet**: [`Chain`](README.md#chain)\< `59144` \> = `LINEA_NETWORK`

#### Source

[libs/sdk/src/chains/index.ts:5](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/chains/index.ts#L5)

---

### NATIVE_TOKEN_ADDRESS

> `const` **NATIVE_TOKEN_ADDRESS**: `"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"` = `'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'`

#### Source

[libs/sdk/src/chains/core.ts:1](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/chains/core.ts#L1)

---

### PERMILLE_MAX

> `const` **PERMILLE_MAX**: `BigNumber`

A utility module for working with permille values, which represent one-tenth of a percentage point.

#### Source

[libs/sdk/src/lib/xfai-utils.ts:41](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L41)

---

### SupportedChainIds

> `const` **SupportedChainIds**: (`5777` \| `59144` \| `59140`)[]

#### Source

[libs/sdk/src/chains/index.ts:11](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/chains/index.ts#L11)

[libs/sdk/src/chains/index.ts:12](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/chains/index.ts#L12)

## Functions

### AccountAddress()

> **AccountAddress**(`address`): [`AccountAddress`](README.md#accountaddress)

#### Parameters

| Parameter | Type     |
| :-------- | :------- |
| `address` | `string` |

#### Returns

[`AccountAddress`](README.md#accountaddress)

#### Source

[libs/sdk/src/lib/xfai.ts:49](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai.ts#L49)

---

### Address()

> **Address**\<`T`\>(`type`, `address`): [`Address`](README.md#address)\< `T` \>

#### Type parameters

| Parameter                                            |
| :--------------------------------------------------- |
| `T` _extends_ [`AddressType`](README.md#addresstype) |

#### Parameters

| Parameter | Type     |
| :-------- | :------- |
| `type`    | `T`      |
| `address` | `string` |

#### Returns

[`Address`](README.md#address)\< `T` \>

#### Source

[libs/sdk/src/lib/xfai.ts:43](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai.ts#L43)

---

### INFT()

> **INFT**(`id`): [`INFT`](README.md#inft)

#### Parameters

| Parameter | Type     |
| :-------- | :------- |
| `id`      | `number` |

#### Returns

[`INFT`](README.md#inft)

#### Source

[libs/sdk/src/lib/inft/core.ts:10](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L10)

---

### Pool()

> **Pool**(`address`): [`Pool`](README.md#pool)

#### Parameters

| Parameter | Type     |
| :-------- | :------- |
| `address` | `string` |

#### Returns

[`Pool`](README.md#pool)

#### Source

[libs/sdk/src/lib/pool/core.ts:11](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L11)

---

### Token()

> **Token**(`address`): [`Token`](README.md#token)

#### Parameters

| Parameter | Type     |
| :-------- | :------- |
| `address` | `string` |

#### Returns

[`Token`](README.md#token)

#### Source

[libs/sdk/src/lib/xfai-token.ts:11](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L11)

---

### addLiquidity()

> **addLiquidity**\<`P`\>(
> `xfai`,
> `ethAmount`,
> `target`,
> `options`): `Promise`\< `PopulatedTransaction` \>

Add liquidity to a pool, in case you're providing single sided ETH, supplementary should be undefined

#### Type parameters

| Parameter                                | Default                    |
| :--------------------------------------- | :------------------------- |
| `P` _extends_ [`Token`](README.md#token) | [`Token`](README.md#token) |

#### Parameters

| Parameter   | Type                                                        |
| :---------- | :---------------------------------------------------------- |
| `xfai`      | [`Xfai`](README.md#xfai)                                    |
| `ethAmount` | `BigNumber`                                                 |
| `target`    | [`LiquidityInAmount`](README.md#liquidityinamount)\< `P` \> |
| `options`   | [`TransactionOptions`](README.md#transactionoptions)        |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/liquidity/add.ts:15](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/liquidity/add.ts#L15)

---

### addSwapFee()

> **addSwapFee**(`xfai`, `amount`): `BigNumber`

#### Parameters

| Parameter | Type                                 |
| :-------- | :----------------------------------- |
| `xfai`    | `number` \| [`Xfai`](README.md#xfai) |
| `amount`  | `BigNumber`                          |

#### Returns

`BigNumber`

#### Source

[libs/sdk/src/lib/pool/core.ts:94](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L94)

---

### basisPointToPercent()

> **basisPointToPercent**(`value`): `number`

Converts a basis point value to its equivalent percentage value.

#### Parameters

| Parameter | Type        | Description                                            |
| :-------- | :---------- | :----------------------------------------------------- |
| `value`   | `BigNumber` | The basis point value to be converted, as a BigNumber. |

#### Returns

`number`

The equivalent percentage value.

#### Source

[libs/sdk/src/lib/xfai-utils.ts:20](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L20)

---

### boostToken()

> **boostToken**(
> `xfai`,
> `inft`,
> `amountIn`,
> `minShare`,
> `options`): `Promise`\< `PopulatedTransaction` \>

#### Parameters

| Parameter  | Type                                     |
| :--------- | :--------------------------------------- |
| `xfai`     | [`Xfai`](README.md#xfai)                 |
| `inft`     | [`INFT`](README.md#inft)                 |
| `amountIn` | `BigNumber`                              |
| `minShare` | `BigNumber`                              |
| `options`  | [`BoostOptions`](README.md#boostoptions) |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/inft/boost.ts:9](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/inft/boost.ts#L9)

---

### calculateDeadline()

> **calculateDeadline**(`param0`): `string`

Convert the date object to unix timestamp

#### Parameters

| Parameter         | Type     | Description |
| :---------------- | :------- | :---------- |
| `param0`          | `object` |             |
| `param0.deadline` | `Date`   | -           |

#### Returns

`string`

unix timestamp

#### Source

[libs/sdk/src/lib/xfai-utils.ts:62](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L62)

---

### calculatePriceImpact()

> **calculatePriceImpact**(`input`, `output`): `number`

#### Parameters

| Parameter | Type        |
| :-------- | :---------- |
| `input`   | `BigNumber` |
| `output`  | `BigNumber` |

#### Returns

`number`

#### Source

[libs/sdk/src/lib/xfai-utils.ts:217](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L217)

---

### calculateShare()

> **calculateShare**(`inftState`, `input`): `BigNumber`

#### Parameters

| Parameter   | Type                               |
| :---------- | :--------------------------------- |
| `inftState` | [`INFTState`](README.md#inftstate) |
| `input`     | `BigNumber`                        |

#### Returns

`BigNumber`

#### Source

[libs/sdk/src/lib/inft/core.ts:60](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L60)

---

### calculateSwapFee()

> **calculateSwapFee**(`xfai`, `amount`): `BigNumber`

#### Parameters

| Parameter | Type                                 |
| :-------- | :----------------------------------- |
| `xfai`    | `number` \| [`Xfai`](README.md#xfai) |
| `amount`  | `BigNumber`                          |

#### Returns

`BigNumber`

#### Source

[libs/sdk/src/lib/pool/core.ts:85](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L85)

---

### delayMs()

> **delayMs**(`ms`): `Promise`\< `unknown` \>

#### Parameters

| Parameter | Type     |
| :-------- | :------- |
| `ms`      | `number` |

#### Returns

`Promise`\< `unknown` \>

#### Source

[libs/sdk/src/lib/xfai-utils.ts:166](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L166)

---

### deriveToAddress()

> **deriveToAddress**(`__namedParameters`): `Promise`\< `string` \>

#### Parameters

| Parameter           | Type                                                                                 |
| :------------------ | :----------------------------------------------------------------------------------- |
| `__namedParameters` | `Pick`\< [`TransactionOptions`](README.md#transactionoptions), `"from"` \| `"to"` \> |

#### Returns

`Promise`\< `string` \>

#### Source

[libs/sdk/src/lib/periphery/core.ts:20](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/core.ts#L20)

---

### getAdjustedAmountInput()

> **getAdjustedAmountInput**(`pool`, `ethOut`): `BigNumber`

Returns the amount of token that's needed to get the desired eth reserve out

#### Parameters

| Parameter | Type                               | Description |
| :-------- | :--------------------------------- | :---------- |
| `pool`    | [`PoolState`](README.md#poolstate) |             |
| `ethOut`  | `BigNumber`                        |             |

#### Returns

`BigNumber`

amountIn

#### Source

[libs/sdk/src/lib/xfai-utils.ts:102](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L102)

---

### getAdjustedAmountOutput()

> **getAdjustedAmountOutput**(`pool`, `ethIn`): `BigNumber`

#### Parameters

| Parameter | Type                               | Description |
| :-------- | :--------------------------------- | :---------- |
| `pool`    | [`PoolState`](README.md#poolstate) |             |
| `ethIn`   | `BigNumber`                        | -           |

#### Returns

`BigNumber`

amountOut

#### Source

[libs/sdk/src/lib/xfai-utils.ts:143](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L143)

---

### getAdjustedEthInput()

> **getAdjustedEthInput**(`pool`, `amountOut`): `BigNumber`

Returns the xf that's needed to get the desired token amount out

#### Parameters

| Parameter   | Type                               | Description |
| :---------- | :--------------------------------- | :---------- |
| `pool`      | [`PoolState`](README.md#poolstate) |             |
| `amountOut` | `BigNumber`                        |             |

#### Returns

`BigNumber`

xfIn

#### Source

[libs/sdk/src/lib/xfai-utils.ts:118](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L118)

---

### getAdjustedEthOutput()

> **getAdjustedEthOutput**(`pool`, `amountIn`): `BigNumber`

Returns the eth reserve out for the token amount in

#### Parameters

| Parameter  | Type                               | Description |
| :--------- | :--------------------------------- | :---------- |
| `pool`     | [`PoolState`](README.md#poolstate) |             |
| `amountIn` | `BigNumber`                        |             |

#### Returns

`BigNumber`

xfOut

#### Source

[libs/sdk/src/lib/xfai-utils.ts:133](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L133)

---

### getCore()

> **getCore**(`xfai`): `IXfaiV0Core`

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |

#### Returns

`IXfaiV0Core`

#### Source

[libs/sdk/src/lib/xfai-core.ts:10](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-core.ts#L10)

---

### getFactory()

> **getFactory**(`xfai`): `IXfaiFactory`

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |

#### Returns

`IXfaiFactory`

#### Source

[libs/sdk/src/lib/factory.ts:4](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/factory.ts#L4)

---

### getINFT()

> **getINFT**(`xfai`, `signer` = `false`): `IXfaiINFT`

#### Parameters

| Parameter | Type                     | Default value |
| :-------- | :----------------------- | :------------ |
| `xfai`    | [`Xfai`](README.md#xfai) | `undefined`   |
| `signer`  | `boolean`                | `false`       |

#### Returns

`IXfaiINFT`

#### Source

[libs/sdk/src/lib/inft/core.ts:32](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L32)

---

### getINFTBalance()

> **getINFTBalance**(`xfai`, `account`): `Promise`\< `number` \>

#### Parameters

| Parameter | Type                                         |
| :-------- | :------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                     |
| `account` | [`AccountAddress`](README.md#accountaddress) |

#### Returns

`Promise`\< `number` \>

#### Source

[libs/sdk/src/lib/inft/balance.ts:14](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/balance.ts#L14)

---

### getINFTOwnership()

> **getINFTOwnership**(`xfai`, `inft`): `Promise`\< \{`owner`: `string`;} \>

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |
| `inft`    | [`INFT`](README.md#inft) |

#### Returns

`Promise`\< \{`owner`: `string`;} \>

#### Source

[libs/sdk/src/lib/inft/core.ts:39](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L39)

---

### getINFTPeriphery()

> **getINFTPeriphery**(`xfai`, `signer`): `IInfinityNFTPeriphery`

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |
| `signer`  | `Signer`                 |

#### Returns

`IInfinityNFTPeriphery`

#### Source

[libs/sdk/src/lib/periphery/core.ts:8](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/core.ts#L8)

---

### getINFTPeripheryAllowance()

> **getINFTPeripheryAllowance**(
> `xfai`,
> `wallet`,
> `token`): `BigNumber` \| `Promise`\< `BigNumber` \>

#### Parameters

| Parameter | Type                                                     |
| :-------- | :------------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                                 |
| `wallet`  | `Wallet` \| [`AccountAddress`](README.md#accountaddress) |
| `token`   | [`Token`](README.md#token) \| [`Pool`](README.md#pool)   |

#### Returns

`BigNumber` \| `Promise`\< `BigNumber` \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:94](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L94)

---

### getINFTState()

> **getINFTState**(`xfai`, `options`): `Promise`\< [`INFTState`](README.md#inftstate) \>

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |
| `options` | `CallOverrides`          |

#### Returns

`Promise`\< [`INFTState`](README.md#inftstate) \>

#### Source

[libs/sdk/src/lib/inft/core.ts:50](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L50)

---

### getINFTTokenBalance()

> **getINFTTokenBalance**(
> `xfai`,
> `inft`,
> `token`): `Promise`\< [`INFTBalance`](README.md#inftbalance) \>

#### Parameters

| Parameter | Type                       |
| :-------- | :------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)   |
| `inft`    | [`INFT`](README.md#inft)   |
| `token`   | [`Token`](README.md#token) |

#### Returns

`Promise`\< [`INFTBalance`](README.md#inftbalance) \>

#### Source

[libs/sdk/src/lib/inft/balance.ts:18](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/balance.ts#L18)

---

### getINFTTokenBalanceMulticall()

> **getINFTTokenBalanceMulticall**\<`T`\>(
> `xfai`,
> `inft`,
> `tokens`,
> `allowFailure`): `Promise`\< `Record`\< [`Token`](README.md#token)[`"address"`], `T` _extends_ `true` ? `undefined` \| [`INFTBalance`](README.md#inftbalance) : [`INFTBalance`](README.md#inftbalance) \> \>

#### Type parameters

| Parameter               |
| :---------------------- |
| `T` _extends_ `boolean` |

#### Parameters

| Parameter      | Type                         |
| :------------- | :--------------------------- |
| `xfai`         | [`Xfai`](README.md#xfai)     |
| `inft`         | [`INFT`](README.md#inft)     |
| `tokens`       | [`Token`](README.md#token)[] |
| `allowFailure` | `T`                          |

#### Returns

`Promise`\< `Record`\< [`Token`](README.md#token)[`"address"`], `T` _extends_ `true` ? `undefined` \| [`INFTBalance`](README.md#inftbalance) : [`INFTBalance`](README.md#inftbalance) \> \>

#### Source

[libs/sdk/src/lib/inft/balance.ts:31](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/balance.ts#L31)

---

### getINFTsForOwner()

> **getINFTsForOwner**(
> `xfai`,
> `owner`,
> `balance`): `Promise`\< `Record`\< `string` \| `number`, `BigNumber` \> \>

#### Parameters

| Parameter | Type                                         |
| :-------- | :------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                     |
| `owner`   | [`AccountAddress`](README.md#accountaddress) |
| `balance` | `number`                                     |

#### Returns

`Promise`\< `Record`\< `string` \| `number`, `BigNumber` \> \>

#### Source

[libs/sdk/src/lib/inft/balance.ts:67](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/balance.ts#L67)

---

### getInftImage()

> **getInftImage**(`inft`, `quality`?): `string`

#### Parameters

| Parameter  | Type                       |
| :--------- | :------------------------- |
| `inft`     | [`INFT`](README.md#inft)   |
| `quality`? | `"md"` \| `"sm"` \| `"lg"` |

#### Returns

`string`

#### Source

[libs/sdk/src/lib/inft/core.ts:17](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/core.ts#L17)

---

### getOraclePrice()

> **getOraclePrice**(`xfai`, `token`): `Promise`\< `BigNumber` \>

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |
| `token`   | `TokenInfo`              |

#### Returns

`Promise`\< `BigNumber` \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:150](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L150)

---

### getPeriphery()

> **getPeriphery**(`xfai`, `signer`): `IXfaiV0Periphery03`

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |
| `signer`  | `Signer`                 |

#### Returns

`IXfaiV0Periphery03`

#### Source

[libs/sdk/src/lib/periphery/core.ts:4](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/core.ts#L4)

---

### getPeripheryAllowance()

> **getPeripheryAllowance**(
> `xfai`,
> `wallet`,
> `token`): `BigNumber` \| `Promise`\< `BigNumber` \>

#### Parameters

| Parameter | Type                                                     |
| :-------- | :------------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                                 |
| `wallet`  | `Wallet` \| [`AccountAddress`](README.md#accountaddress) |
| `token`   | [`Token`](README.md#token) \| [`Pool`](README.md#pool)   |

#### Returns

`BigNumber` \| `Promise`\< `BigNumber` \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:84](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L84)

---

### getPool()

> **getPool**(`xfai`, `pool`): `IXfaiPool`

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |
| `pool`    | [`Pool`](README.md#pool) |

#### Returns

`IXfaiPool`

#### Source

[libs/sdk/src/lib/pool/core.ts:23](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L23)

---

### getPoolBalance()

> **getPoolBalance**(
> `xfai`,
> `wallet`,
> `token`): `Promise`\< `BigNumber` \>

#### Parameters

| Parameter | Type                                |
| :-------- | :---------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)            |
| `wallet`  | `Wallet` \| \{`address`: `string`;} |
| `token`   | [`Token`](README.md#token)          |

#### Returns

`Promise`\< `BigNumber` \>

#### Source

[libs/sdk/src/lib/pool/balance.ts:6](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/balance.ts#L6)

---

### getPoolBalanceMulticall()

> **getPoolBalanceMulticall**(
> `xfai`,
> `wallet`,
> `tokens`): `Promise`\< `Record`\< `string`, `BigNumber` \| `undefined` \> \>

#### Parameters

| Parameter | Type                                |
| :-------- | :---------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)            |
| `wallet`  | `Wallet` \| \{`address`: `string`;} |
| `tokens`  | [`Token`](README.md#token)[]        |

#### Returns

`Promise`\< `Record`\< `string`, `BigNumber` \| `undefined` \> \>

#### Source

[libs/sdk/src/lib/pool/multicall.ts:8](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/multicall.ts#L8)

---

### getPoolFromToken()

> **getPoolFromToken**(`xfai`, `token`): [`Pool`](README.md#pool)

#### Parameters

| Parameter | Type                       |
| :-------- | :------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)   |
| `token`   | [`Token`](README.md#token) |

#### Returns

[`Pool`](README.md#pool)

#### Source

[libs/sdk/src/lib/pool/core.ts:35](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L35)

---

### getPoolFromTokenAddress()

> **getPoolFromTokenAddress**(`xfai`, `token`): `IXfaiPool`

#### Parameters

| Parameter | Type                       |
| :-------- | :------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)   |
| `token`   | [`Token`](README.md#token) |

#### Returns

`IXfaiPool`

#### Source

[libs/sdk/src/lib/pool/core.ts:27](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L27)

---

### getPoolLiquidityMulticall()

> **getPoolLiquidityMulticall**(`xfai`, `tokens`): `Promise`\< `Record`\< `string` \| `number`, `undefined` \| `BigNumber` \> \>

#### Parameters

| Parameter | Type                         |
| :-------- | :--------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)     |
| `tokens`  | [`Token`](README.md#token)[] |

#### Returns

`Promise`\< `Record`\< `string` \| `number`, `undefined` \| `BigNumber` \> \>

#### Source

[libs/sdk/src/lib/pool/multicall.ts:42](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/multicall.ts#L42)

---

### getPoolNameForTokenAddress()

> **getPoolNameForTokenAddress**(`xfai`, `token`): `Promise`\< `string` \>

#### Parameters

| Parameter | Type                       |
| :-------- | :------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)   |
| `token`   | [`Token`](README.md#token) |

#### Returns

`Promise`\< `string` \>

#### Source

[libs/sdk/src/lib/pool/core.ts:31](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L31)

---

### getPoolState()

> **getPoolState**(
> `xfai`,
> `pool`,
> `options` = `{}`): `Promise`\< [`PoolState`](README.md#poolstate) \>

#### Parameters

| Parameter | Type                     |
| :-------- | :----------------------- |
| `xfai`    | [`Xfai`](README.md#xfai) |
| `pool`    | [`Pool`](README.md#pool) |
| `options` | `CallOverrides`          |

#### Returns

`Promise`\< [`PoolState`](README.md#poolstate) \>

#### Source

[libs/sdk/src/lib/pool/core.ts:45](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L45)

---

### getPoolStateMulticall()

> **getPoolStateMulticall**(`xfai`, `poolsOrTokens`): `Promise`\< \{} \>

#### Parameters

| Parameter       | Type                                                       |
| :-------------- | :--------------------------------------------------------- |
| `xfai`          | [`Xfai`](README.md#xfai)                                   |
| `poolsOrTokens` | [`Token`](README.md#token)[] \| [`Pool`](README.md#pool)[] |

#### Returns

`Promise`\< \{} \>

#### Source

[libs/sdk/src/lib/pool/core.ts:53](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L53)

---

### getPoolSupply()

> **getPoolSupply**(`xfai`, `token`): `Promise`\< `BigNumber` \>

#### Parameters

| Parameter | Type                       |
| :-------- | :------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)   |
| `token`   | [`Token`](README.md#token) |

#### Returns

`Promise`\< `BigNumber` \>

#### Source

[libs/sdk/src/lib/pool/balance.ts:18](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/balance.ts#L18)

---

### getPoolTokenBalance()

> **getPoolTokenBalance**(`xfai`, `token`): `Promise`\< `BigNumber` \>

#### Parameters

| Parameter | Type                       |
| :-------- | :------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)   |
| `token`   | [`Token`](README.md#token) |

#### Returns

`Promise`\< `BigNumber` \>

#### Source

[libs/sdk/src/lib/pool/balance.ts:14](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/balance.ts#L14)

---

### getPoolTokenBalanceMulticall()

> **getPoolTokenBalanceMulticall**(`xfai`, `tokens`): `Promise`\< `Record`\< `string` \| `number`, `undefined` \| `BigNumber` \> \>

#### Parameters

| Parameter | Type                         |
| :-------- | :--------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)     |
| `tokens`  | [`Token`](README.md#token)[] |

#### Returns

`Promise`\< `Record`\< `string` \| `number`, `undefined` \| `BigNumber` \> \>

#### Source

[libs/sdk/src/lib/pool/multicall.ts:27](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/multicall.ts#L27)

---

### getSpotAmount()

> **getSpotAmount**(`pool`, `ethIn`): `BigNumber`

Return the amount out for a given xf In

#### Parameters

| Parameter | Type                               | Description |
| :-------- | :--------------------------------- | :---------- |
| `pool`    | [`PoolState`](README.md#poolstate) |             |
| `ethIn`   | `BigNumber`                        |             |

#### Returns

`BigNumber`

amountIn

#### Source

[libs/sdk/src/lib/xfai-utils.ts:79](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L79)

---

### getSpotEth()

> **getSpotEth**(`pool`, `amountIn`): `BigNumber`

Return the xf out for a given amount in

#### Parameters

| Parameter  | Type                               | Description |
| :--------- | :--------------------------------- | :---------- |
| `pool`     | [`PoolState`](README.md#poolstate) |             |
| `amountIn` | `BigNumber`                        |             |

#### Returns

`BigNumber`

xfOut

#### Source

[libs/sdk/src/lib/xfai-utils.ts:92](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L92)

---

### getSwapAmounts()

> **getSwapAmounts**\<`T`, `P`\>(
> `xfai`,
> `tradeType`,
> `tokenIn`,
> `tokenOut`,
> `amount`): [`SwapAmount`](README.md#swapamount)

#### Type parameters

| Parameter                                                       | Default                                           |
| :-------------------------------------------------------------- | :------------------------------------------------ |
| `T` _extends_ [`TradeType`](README.md#tradetype)                | -                                                 |
| `P` _extends_ `undefined` \| [`PoolState`](README.md#poolstate) | `undefined` \| [`PoolState`](README.md#poolstate) |

#### Parameters

| Parameter        | Type                                                                                                               |
| :--------------- | :----------------------------------------------------------------------------------------------------------------- |
| `xfai`           | [`Xfai`](README.md#xfai)                                                                                           |
| `tradeType`      | `T`                                                                                                                |
| `tokenIn`        | `object`                                                                                                           |
| `tokenIn.state`  | `P`                                                                                                                |
| `tokenIn.token`  | [`Token`](README.md#token)                                                                                         |
| `tokenOut`       | `object`                                                                                                           |
| `tokenOut.state` | `P` _extends_ `undefined` ? [`PoolState`](README.md#poolstate) : `undefined` \| [`PoolState`](README.md#poolstate) |
| `tokenOut.token` | [`Token`](README.md#token)                                                                                         |
| `amount`         | `BigNumber`                                                                                                        |

#### Returns

[`SwapAmount`](README.md#swapamount)

#### Source

[libs/sdk/src/lib/pool/swap-amounts.ts:126](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/swap-amounts.ts#L126)

---

### getSwapInputAmount()

> **getSwapInputAmount**\<`P`\>(
> `xfai`,
> `tokenIn`,
> `tokenOut`,
> `outputAmount`): [`SwapAmount`](README.md#swapamount)

Returns the amount of tokenIn needed for swapping tokenOutAmount of tokenIn

#### Type parameters

| Parameter                                                       | Default                                           |
| :-------------------------------------------------------------- | :------------------------------------------------ |
| `P` _extends_ `undefined` \| [`PoolState`](README.md#poolstate) | `undefined` \| [`PoolState`](README.md#poolstate) |

#### Parameters

| Parameter        | Type                                                                                                               |
| :--------------- | :----------------------------------------------------------------------------------------------------------------- |
| `xfai`           | [`Xfai`](README.md#xfai)                                                                                           |
| `tokenIn`        | `object`                                                                                                           |
| `tokenIn.state`  | `P`                                                                                                                |
| `tokenIn.token`  | [`Token`](README.md#token)                                                                                         |
| `tokenOut`       | `object`                                                                                                           |
| `tokenOut.state` | `P` _extends_ `undefined` ? [`PoolState`](README.md#poolstate) : `undefined` \| [`PoolState`](README.md#poolstate) |
| `tokenOut.token` | [`Token`](README.md#token)                                                                                         |
| `outputAmount`   | `BigNumber`                                                                                                        |

#### Returns

[`SwapAmount`](README.md#swapamount)

tokenInInput

#### Source

[libs/sdk/src/lib/pool/swap-amounts.ts:79](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/swap-amounts.ts#L79)

---

### getSwapOutputAmount()

> **getSwapOutputAmount**\<`P`\>(
> `xfai`,
> `tokenIn`,
> `tokenOut`,
> `inputAmount`): [`SwapAmount`](README.md#swapamount)

Returns the amount of tokenOut after swapping tokenInAmount of tokenIn

#### Type parameters

| Parameter                                                       | Default                                           |
| :-------------------------------------------------------------- | :------------------------------------------------ |
| `P` _extends_ `undefined` \| [`PoolState`](README.md#poolstate) | `undefined` \| [`PoolState`](README.md#poolstate) |

#### Parameters

| Parameter        | Type                                                                                                               | Description |
| :--------------- | :----------------------------------------------------------------------------------------------------------------- | :---------- |
| `xfai`           | [`Xfai`](README.md#xfai)                                                                                           | -           |
| `tokenIn`        | `object`                                                                                                           | -           |
| `tokenIn.state`  | `P`                                                                                                                | -           |
| `tokenIn.token`  | [`Token`](README.md#token)                                                                                         | -           |
| `tokenOut`       | `object`                                                                                                           | -           |
| `tokenOut.state` | `P` _extends_ `undefined` ? [`PoolState`](README.md#poolstate) : `undefined` \| [`PoolState`](README.md#poolstate) | -           |
| `tokenOut.token` | [`Token`](README.md#token)                                                                                         | -           |
| `inputAmount`    | `BigNumber`                                                                                                        |             |

#### Returns

[`SwapAmount`](README.md#swapamount)

tokenOutAmount

#### Source

[libs/sdk/src/lib/pool/swap-amounts.ts:26](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/swap-amounts.ts#L26)

---

### getToken()

> **getToken**(`xfai`, `token`): `IERC20Metadata`

#### Parameters

| Parameter | Type                                                   |
| :-------- | :----------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                               |
| `token`   | [`Token`](README.md#token) \| [`Pool`](README.md#pool) |

#### Returns

`IERC20Metadata`

#### Source

[libs/sdk/src/lib/xfai-token.ts:25](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L25)

---

### getTokenBalance()

> **getTokenBalance**(
> `xfai`,
> `wallet`,
> `token`): `Promise`\< `BigNumber` \>

#### Parameters

| Parameter | Type                                                     |
| :-------- | :------------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                                 |
| `wallet`  | `Wallet` \| [`AccountAddress`](README.md#accountaddress) |
| `token`   | [`Token`](README.md#token)                               |

#### Returns

`Promise`\< `BigNumber` \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:28](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L28)

---

### getTokenBalanceMulticall()

> **getTokenBalanceMulticall**(
> `xfai`,
> `wallet`,
> `tokens`): `Promise`\< `Record`\< [`Token`](README.md#token)[`"address"`], `BigNumber` \| `undefined` \> \>

#### Parameters

| Parameter | Type                                |
| :-------- | :---------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)            |
| `wallet`  | `Wallet` \| \{`address`: `string`;} |
| `tokens`  | [`Token`](README.md#token)[]        |

#### Returns

`Promise`\< `Record`\< [`Token`](README.md#token)[`"address"`], `BigNumber` \| `undefined` \> \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:39](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L39)

---

### getTokenDetails()

> **getTokenDetails**(`xfai`, `token`): `Promise`\< `TokenInfo` \>

#### Parameters

| Parameter | Type                       |
| :-------- | :------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)   |
| `token`   | [`Token`](README.md#token) |

#### Returns

`Promise`\< `TokenInfo` \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:105](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L105)

---

### getTransactionGasCost()

> **getTransactionGasCost**(`tx`): `undefined` \| `BigNumber`

Tries to estimate the gas limit for a TransactionReceipt or ContractTransaction

#### Parameters

| Parameter | Type                                          | Description                               |
| :-------- | :-------------------------------------------- | :---------------------------------------- |
| `tx`      | `ContractTransaction` \| `TransactionReceipt` | TransactionReceipt \| ContractTransaction |

#### Returns

`undefined` \| `BigNumber`

BigNumber | undefined

#### Source

[libs/sdk/src/lib/xfai-utils.ts:201](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L201)

---

### handleNativeToken()

> **handleNativeToken**(`xfai`, `token`): [`Token`](README.md#token) \| [`Pool`](README.md#pool)

#### Parameters

| Parameter | Type                                                   |
| :-------- | :----------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                               |
| `token`   | [`Token`](README.md#token) \| [`Pool`](README.md#pool) |

#### Returns

[`Token`](README.md#token) \| [`Pool`](README.md#pool)

#### Source

[libs/sdk/src/lib/xfai-token.ts:143](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L143)

---

### harvestINFT()

> **harvestINFT**(
> `xfai`,
> `inft`,
> `token`,
> `amountOut`): `Promise`\< `PopulatedTransaction` \>

#### Parameters

| Parameter   | Type                       |
| :---------- | :------------------------- |
| `xfai`      | [`Xfai`](README.md#xfai)   |
| `inft`      | [`INFT`](README.md#inft)   |
| `token`     | [`Token`](README.md#token) |
| `amountOut` | `BigNumber`                |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/inft/harvest.ts:6](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/inft/harvest.ts#L6)

---

### harvestInftErc20()

> **harvestInftErc20**(
> `xfai`,
> `inft`,
> `token`,
> `amountOut`): `Promise`\< `PopulatedTransaction` \>

#### Parameters

| Parameter   | Type                       |
| :---------- | :------------------------- |
| `xfai`      | [`Xfai`](README.md#xfai)   |
| `inft`      | [`INFT`](README.md#inft)   |
| `token`     | [`Token`](README.md#token) |
| `amountOut` | `BigNumber`                |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/inft/harvest.ts:23](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/inft/harvest.ts#L23)

---

### harvestInftEth()

> **harvestInftEth**(
> `xfai`,
> `inft`,
> `amountOut`): `Promise`\< `PopulatedTransaction` \>

#### Parameters

| Parameter   | Type                     |
| :---------- | :----------------------- |
| `xfai`      | [`Xfai`](README.md#xfai) |
| `inft`      | [`INFT`](README.md#inft) |
| `amountOut` | `BigNumber`              |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/inft/harvest.ts:18](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/inft/harvest.ts#L18)

---

### isNativeToken()

> **isNativeToken**(`token`): `boolean`

#### Parameters

| Parameter | Type                                                                  |
| :-------- | :-------------------------------------------------------------------- |
| `token`   | `undefined` \| [`Token`](README.md#token) \| [`Pool`](README.md#pool) |

#### Returns

`boolean`

#### Source

[libs/sdk/src/lib/xfai-token.ts:22](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L22)

---

### isParsedEthersError()

> **isParsedEthersError**(`error`): `error is ParsedEthersError`

#### Parameters

| Parameter | Type      |
| :-------- | :-------- |
| `error`   | `unknown` |

#### Returns

`error is ParsedEthersError`

#### Source

[libs/sdk/src/lib/xfai-core.ts:14](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-core.ts#L14)

---

### isSharedToken()

> **isSharedToken**(`xfai`, `token`): `boolean`

#### Parameters

| Parameter | Type                                                                  |
| :-------- | :-------------------------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                                              |
| `token`   | `undefined` \| [`Token`](README.md#token) \| [`Pool`](README.md#pool) |

#### Returns

`boolean`

#### Source

[libs/sdk/src/lib/xfai-token.ts:19](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L19)

---

### isUnderlyingToken()

> **isUnderlyingToken**(`xfai`, `token`): `boolean`

#### Parameters

| Parameter | Type                       |
| :-------- | :------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)   |
| `token`   | [`Token`](README.md#token) |

#### Returns

`boolean`

#### Source

[libs/sdk/src/lib/xfai-token.ts:13](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L13)

---

### isWrappedNativeToken()

> **isWrappedNativeToken**(`xfai`, `token`): `boolean`

#### Parameters

| Parameter | Type                                                                  |
| :-------- | :-------------------------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                                              |
| `token`   | `undefined` \| [`Token`](README.md#token) \| [`Pool`](README.md#pool) |

#### Returns

`boolean`

#### Source

[libs/sdk/src/lib/xfai-token.ts:16](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L16)

---

### max()

> **max**(`a`, `b`): `BigNumber`

#### Parameters

| Parameter | Type        |
| :-------- | :---------- |
| `a`       | `BigNumber` |
| `b`       | `BigNumber` |

#### Returns

`BigNumber`

#### Source

[libs/sdk/src/lib/xfai-utils.ts:69](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L69)

---

### min()

> **min**(`a`, `b`): `BigNumber`

#### Parameters

| Parameter | Type        |
| :-------- | :---------- |
| `a`       | `BigNumber` |
| `b`       | `BigNumber` |

#### Returns

`BigNumber`

#### Source

[libs/sdk/src/lib/xfai-utils.ts:65](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L65)

---

### multicall()

> **multicall**\<`T`, `B`, `F`\>(
> `xfai`,
> `contract`,
> `calls`,
> `options`?): `Promise`\< `Record`\< `string` \| `number`, `B` _extends_ `true` ? `undefined` \| `Awaited`\< `ReturnType`\< `ReturnType`\< `T`[`"connect"`] \>[`"callStatic"`][`F`] \> \> : `Awaited`\< `ReturnType`\< `ReturnType`\< `T`[`"connect"`] \>[`"callStatic"`][`F`] \> \> \> \>

#### Type parameters

| Parameter                                   |
| :------------------------------------------ |
| `T` _extends_ `Factory`\< `BaseContract` \> |
| `B` _extends_ `boolean`                     |
| `F` _extends_ `string`                      |

#### Parameters

| Parameter                | Type                                                                            |
| :----------------------- | :------------------------------------------------------------------------------ |
| `xfai`                   | [`Xfai`](README.md#xfai)                                                        |
| `contract`               | `T`                                                                             |
| `calls`                  | `CallArg`\< `T`, `F` \>[]                                                       |
| `options`?               | `object`                                                                        |
| `options.allowFailure`?  | `B`                                                                             |
| `options.callOverrides`? | `Overrides`                                                                     |
| `options.key`?           | (`arg`, `index`) => `string` \| `number` \| `Promise`\< `string` \| `number` \> |

#### Returns

`Promise`\< `Record`\< `string` \| `number`, `B` _extends_ `true` ? `undefined` \| `Awaited`\< `ReturnType`\< `ReturnType`\< `T`[`"connect"`] \>[`"callStatic"`][`F`] \> \> : `Awaited`\< `ReturnType`\< `ReturnType`\< `T`[`"connect"`] \>[`"callStatic"`][`F`] \> \> \> \>

#### Source

[libs/sdk/src/lib/multicall.ts:19](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/multicall.ts#L19)

---

### negativeSlippage()

> **negativeSlippage**(`amount`, `slippage`): `BigNumber`

Decreases the amount by the provided slippage (100 - 1% slippage) = (99)

#### Parameters

| Parameter  | Type           | Description |
| :--------- | :------------- | :---------- |
| `amount`   | `BigNumber`    |             |
| `slippage` | `BigNumberish` |             |

#### Returns

`BigNumber`

amount with negative slippage

#### Source

[libs/sdk/src/lib/xfai-utils.ts:152](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L152)

---

### positiveSlippage()

> **positiveSlippage**(`amount`, `slippage`): `BigNumber`

Increases the amount by the provided slippage (100 + 1% slippage) = (101)

#### Parameters

| Parameter  | Type           | Description |
| :--------- | :------------- | :---------- |
| `amount`   | `BigNumber`    |             |
| `slippage` | `BigNumberish` |             |

#### Returns

`BigNumber`

amount with positive slippage

#### Source

[libs/sdk/src/lib/xfai-utils.ts:162](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L162)

---

### quote()

> **quote**\<`T`\>(`__namedParameters`): [`QuoteResult`](README.md#quoteresult)\< `T` \>

#### Type parameters

| Parameter                                        |
| :----------------------------------------------- |
| `T` _extends_ [`QuoteBase`](README.md#quotebase) |

#### Parameters

| Parameter           | Type                                |
| :------------------ | :---------------------------------- |
| `__namedParameters` | [`Quote`](README.md#quote)\< `T` \> |

#### Returns

[`QuoteResult`](README.md#quoteresult)\< `T` \>

#### Source

[libs/sdk/src/lib/pool/quote.ts:29](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/quote.ts#L29)

---

### removeLiquidity()

> **removeLiquidity**(
> `xfai`,
> `lpTokenAmount`,
> `target`,
> `supplementary`,
> `options`): `Promise`\< `PopulatedTransaction` \>

Remove liquidity from a pool,

#### Parameters

| Parameter       | Type                                                 |
| :-------------- | :--------------------------------------------------- |
| `xfai`          | [`Xfai`](README.md#xfai)                             |
| `lpTokenAmount` | `BigNumber`                                          |
| `target`        | [`TargetTokenAmount`](README.md#targettokenamount)   |
| `supplementary` | [`TargetTokenAmount`](README.md#targettokenamount)   |
| `options`       | [`TransactionOptions`](README.md#transactionoptions) |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/liquidity/remove.ts:14](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/liquidity/remove.ts#L14)

---

### requestAllowance()

> **requestAllowance**(`xfai`, `token`): `Promise`\< `PopulatedTransaction` \>

#### Parameters

| Parameter | Type                                                   |
| :-------- | :----------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                               |
| `token`   | [`Token`](README.md#token) \| [`Pool`](README.md#pool) |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:66](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L66)

---

### requestINFTAllowance()

> **requestINFTAllowance**(`xfai`, `token`): `Promise`\< `PopulatedTransaction` \>

#### Parameters

| Parameter | Type                                                   |
| :-------- | :----------------------------------------------------- |
| `xfai`    | [`Xfai`](README.md#xfai)                               |
| `token`   | [`Token`](README.md#token) \| [`Pool`](README.md#pool) |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/xfai-token.ts:75](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-token.ts#L75)

---

### sendPopulatedTx()

> **sendPopulatedTx**(`xfai`, `populatedTx`): `Promise`\< `TransactionResponse` \>

Send a populated transaction

#### Parameters

| Parameter     | Type                                                            | Description |
| :------------ | :-------------------------------------------------------------- | :---------- |
| `xfai`        | [`Xfai`](README.md#xfai)                                        |             |
| `populatedTx` | `PopulatedTransaction` \| `Promise`\< `PopulatedTransaction` \> |             |

#### Returns

`Promise`\< `TransactionResponse` \>

PopulatedTransaction

#### Source

[libs/sdk/src/lib/xfai-utils.ts:176](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L176)

---

### stakeToken()

> **stakeToken**(
> `xfai`,
> `amountIn`,
> `minShare`,
> `options`): `Promise`\< `PopulatedTransaction` \>

Stake xfit to get an INFT.
If INFT is specified in options, the INFT will be boosted instead.
Takes a token and an amount in and min share out.

#### Parameters

| Parameter  | Type                                                                                           |
| :--------- | :--------------------------------------------------------------------------------------------- |
| `xfai`     | [`Xfai`](README.md#xfai)                                                                       |
| `amountIn` | `BigNumber`                                                                                    |
| `minShare` | `BigNumber`                                                                                    |
| `options`  | [`StakeOptions`](README.md#stakeoptions) & \{`inft`: `undefined` \| [`INFT`](README.md#inft);} |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/inft/stake.ts:15](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/inft/stake.ts#L15)

---

### subtractSwapFee()

> **subtractSwapFee**(`xfai`, `amount`): `BigNumber`

#### Parameters

| Parameter | Type                                 |
| :-------- | :----------------------------------- |
| `xfai`    | `number` \| [`Xfai`](README.md#xfai) |
| `amount`  | `BigNumber`                          |

#### Returns

`BigNumber`

#### Source

[libs/sdk/src/lib/pool/core.ts:91](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/pool/core.ts#L91)

---

### swapTokens()

> **swapTokens**\<`T`\>(
> `xfai`,
> `tradeType`,
> `tokenIn`,
> `tokenOut`,
> `amountIn`,
> `desiredAmountOut`,
> `options`): `Promise`\< `PopulatedTransaction` \>

Swap tokens.

#### Type parameters

| Parameter | Default                                |
| :-------- | :------------------------------------- |
| `T`       | [`EXACT_INPUT`](README.md#exact_input) |

#### Parameters

| Parameter          | Type                                                 | Description |
| :----------------- | :--------------------------------------------------- | :---------- |
| `xfai`             | [`Xfai`](README.md#xfai)                             |             |
| `tradeType`        | `T`                                                  |             |
| `tokenIn`          | [`Token`](README.md#token)                           |             |
| `tokenOut`         | [`Token`](README.md#token)                           |             |
| `amountIn`         | `BigNumber`                                          |             |
| `desiredAmountOut` | `BigNumber`                                          | -           |
| `options`          | [`TransactionOptions`](README.md#transactionoptions) |             |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/swap/index.ts:10](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/swap/index.ts#L10)

> **swapTokens**\<`T`\>(
> `xfai`,
> `tradeType`,
> `tokenIn`,
> `tokenOut`,
> `desiredAmountIn`,
> `amountOut`,
> `options`): `Promise`\< `PopulatedTransaction` \>

Swap tokens.

#### Type parameters

| Parameter | Default                                  |
| :-------- | :--------------------------------------- |
| `T`       | [`EXACT_OUTPUT`](README.md#exact_output) |

#### Parameters

| Parameter         | Type                                                 | Description |
| :---------------- | :--------------------------------------------------- | :---------- |
| `xfai`            | [`Xfai`](README.md#xfai)                             |             |
| `tradeType`       | `T`                                                  |             |
| `tokenIn`         | [`Token`](README.md#token)                           |             |
| `tokenOut`        | [`Token`](README.md#token)                           |             |
| `desiredAmountIn` | `BigNumber`                                          | -           |
| `amountOut`       | `BigNumber`                                          |             |
| `options`         | [`TransactionOptions`](README.md#transactionoptions) |             |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/periphery/swap/index.ts:19](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/periphery/swap/index.ts#L19)

---

### transfer()

> **transfer**(
> `xfai`,
> `inft`,
> `newOwner`): `Promise`\< `PopulatedTransaction` \>

#### Parameters

| Parameter  | Type                                         |
| :--------- | :------------------------------------------- |
| `xfai`     | [`Xfai`](README.md#xfai)                     |
| `inft`     | [`INFT`](README.md#inft)                     |
| `newOwner` | [`AccountAddress`](README.md#accountaddress) |

#### Returns

`Promise`\< `PopulatedTransaction` \>

#### Source

[libs/sdk/src/lib/inft/transfer.ts:4](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/inft/transfer.ts#L4)

---

### validateBasisPoint()

> **validateBasisPoint**(`number`): `BigNumber`

Validates a basis point value to ensure it falls within the acceptable range of 0 to 10000.

#### Throws

An error if the provided basis point value is outside the valid range.

#### Parameters

| Parameter | Type           | Description                                                                            |
| :-------- | :------------- | :------------------------------------------------------------------------------------- |
| `number`  | `BigNumberish` | The basis point value to be validated, as a BigNumberish or a compatible numeric type. |

#### Returns

`BigNumber`

The valid basis point value if it falls within the acceptable range.

#### Source

[libs/sdk/src/lib/xfai-utils.ts:30](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L30)

---

### validatePermille()

> **validatePermille**(`number`): `BigNumber`

Validates a permille value to ensure it falls within the acceptable range of 0 to 1000.

#### Throws

An error if the provided permille value is outside the valid range.

#### Parameters

| Parameter | Type           | Description                                                                         |
| :-------- | :------------- | :---------------------------------------------------------------------------------- |
| `number`  | `BigNumberish` | The permille value to be validated, as a BigNumberish or a compatible numeric type. |

#### Returns

`BigNumber`

The valid permille value if it falls within the acceptable range.

#### Source

[libs/sdk/src/lib/xfai-utils.ts:49](https://github.com/xfai-labs/xfai-monorepo/blob/xfai/libs/sdk/src/lib/xfai-utils.ts#L49)

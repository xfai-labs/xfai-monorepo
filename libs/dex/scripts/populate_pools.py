from brownie import accounts, chain, interface
from brownie.network import priority_fee
from datetime import datetime, timedelta
from fractions import Fraction

local_account = accounts.load('xfai_mainnet')

weth_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
xfit_address = "0x4aa41bc1649c9c3177ed16caaa11482295fc7441"
inft_address = "0xd58BCB63b33D5F6984DA687DE2e5B8c61bB0c421"
old_xfai_factory = "0xEe9c77Cc985dcC4fd81e7804ce4C2f380430C333"

periphery = "0x91D8487fE516a3601880794E07579b69a4079663"

token_list = [
        '0x111111111117dc0aa78b770fa6a738034120c302',
        '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
        '0xa1faa113cbe53436df28ff0aee54275c13b40975',
        '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
        '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
        '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
        '0x3472a5a71965499acd81997a54bba8d852c6e53d',
        '0xba100000625a3754423978a60c9317c58a424e3d',
        '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
        '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
        '0x0391d2021f89dc339f60fff84546ea23e337750f',
        '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
        '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
        '0xc00e94cb662c3520282e6f5717214004a7f26888',
        '0xd533a949740bb3306d119cc777fa900ba034cd52',
        '0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d',
        '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
        '0x853d955acef822db058eb8505911ed77f175b99e',
        '0x6810e776880c02933d47db1b9fc05908e5386b96',
        '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
        '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
        '0x767fe9edc9e0df98e07454847909b5e959d7ca0e',
        '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
        '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
        '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
        '0x514910771af9ca656af840dff83e8264ecf986ca',
        '0x0000000000095413afc295d19edeb1ad7b71c952',
        '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
        '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
        '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', # Maker DAO has to be executed
        '0xec67005c4e498ec7f55e092bd1d35cbc47c91892',
        '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
        '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
        '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
        '0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5',
        '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
        '0x0258f474786ddfd37abce6df6bbb1dd5dfc4434a',
        '0xbc396689893d065f41bc2c6ecbee5e0085233447',
        '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
        '0xfca59cd816ab1ead66534d82bc21e7515ce441cf',
        '0x408e41876cccdc0f92210600ef50372656052a38',
        '0xae78736cd615f374d3085123a210448e74fc6393',
        '0x607f4c5bb672230e8672085532f7e901544a7375',
        '0x3155ba85d5f96b2d030a4966af206230e46849cb',
        '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
        '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
        '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
        '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
        '0x0000000000085d4780b73119b644ae5ecd22b376',
        '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
        '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        '0x4aa41bc1649c9c3177ed16caaa11482295fc7441',
        '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
        '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
        '0xa1d0e215a23d7030842fc67ce582a6afa3ccab83',
        '0xe41d2489571d322189246dafa5ebde1f4699f498'
        ]

slippage_tolerance = 5  # 0.5%
delta = timedelta(minutes=20)  # required for function deadlines
deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
eth_amount = 530000000000000000 # 1k usd at the time of writing
eth_amount_min = eth_amount - int(Fraction(eth_amount) * slippage_tolerance / 1000)

def main(wait=False):
    priority_fee("auto")
    periphery_contract = interface.IXfaiV0Periphery01(periphery)
    for token in token_list:
        token_amount = interface.IERC20(token).balanceOf(local_account)
        token_amount_min = token_amount - int(Fraction(token_amount) * slippage_tolerance / 1000)
        if token_amount > 0:
            interface.IERC20(token).approve(periphery, token_amount, {'from': local_account})
            periphery_contract.addLiquidity(
                local_account,
                token,
                token_amount,
                token_amount_min,
                eth_amount_min,
                deadline,
                {"from": local_account, "value": eth_amount}
            )
            print(token)
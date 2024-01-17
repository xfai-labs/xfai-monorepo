#!/usr/bin/python3

from pathlib import Path

XFAIV0_SDK_FOLDER = Path(__file__).parent
DATA_FOLDER = Path(__file__).parent.parent

class Dexfai:
    def __init__(
        self,
        xfai_factory_address: str,
        xfai_core_address: str, 
        xfai_router_address: str, 
        xfai_pool_init_code_hash: str
    ):
        self.xfai_factory_address = xfai_factory_address
        self.xfai_core_address = xfai_core_address
        self.xfai_router_address = xfai_router_address
        self.xfai_pool_init_code_hash = xfai_pool_init_code_hash # https://github.com/Uniswap/v2-core/issues/102


class Chain:
    def __init__(self, chainID: int):
        self.xfai = contract_info[chainID]
        self.wrapped_native_token = wrapped_native_tokens[chainID]

wrapped_native_tokens = {
    1 : "",
    3 : "",
    4 : "",
    5 : "",
    42 : "",
    137 : "",
    56 : "",
    5777: "" # ganache
}

#######
# only used during testing
factory = "0x16cFBc36DC7A9e5fB35aFe830de0C28250907C26"
core = "0xc3736f2A75B19155D749C1854816409036CB1Ec2"
init_code = "0x556f9324b8f8d5747e8a2c28102c19115793c83eac0feffd42ce757e83ca435d"
#######

contract_info = {
    1 : Dexfai(
        "",
        "",
        "",
        ""
    ), # Ethereum mainnet
    3 : Dexfai(
        "",
        "",
        "",
        ""
    ), # Ethereum Ropsten
    4 : Dexfai(
        "",
        "",
        "",
        ""
    ), # Ethereum Rinkeby
    5 : Dexfai(
        "",
        "",
        "",
        ""
    ), # Ethereum Goerli
    42 : Dexfai(
        "",
        "",
        "",
        ""
    ), # Ethereum Kovan
    137 : Dexfai(
        "",
        "",
        "",
        ""
    ), # Polygon
    56 : Dexfai(
        "",
        "",
        "",
        ""
    ), # Binance
    5777 : Dexfai(
        factory,
        core,
        "",
        init_code
    ), # local testing - ganache
}
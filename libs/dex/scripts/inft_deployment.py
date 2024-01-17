from brownie import XfaiINFT, accounts, interface
import json


local_account = accounts.load('xfai_mainnet')

weth_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
xfit_address = "0x4aa41bc1649c9c3177ed16caaa11482295fc7441"
factory_address = "0x0b51D00eF3Df0B66766938220542185F6fDbC0B7"

old_inft = "0xd58BCB63b33D5F6984DA687DE2e5B8c61bB0c421"
old_lnft = "0x9ab5fB83d06702D84413A837F78bFcd37FB8A3C7"
old_factory = "0xEe9c77Cc985dcC4fd81e7804ce4C2f380430C333"

def main(wait=False):
    
    initial_reserve = interface.IERC20(xfit_address).balanceOf(old_lnft) + interface.IERC20(xfit_address).balanceOf(old_factory) + 60000000000000000000000000
    number_of_infts = interface.IERC721Enumerable(old_inft).totalSupply()
    inft_token = local_account.deploy(XfaiINFT, 
                                      factory_address, 
                                      weth_address,
                                      xfit_address,
                                      initial_reserve,
                                      number_of_infts,
                                      publish_source=True
                                      )
    
    print("Deployed INFT")
    print(json.dumps({
        "INFT": inft_token.address
    },
        indent=4
    ))
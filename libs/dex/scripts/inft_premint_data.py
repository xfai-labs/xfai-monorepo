from brownie import XfaiINFT, accounts, interface
from multicall import Call, Multicall


local_account = accounts.load('xfai_mainnet')

old_inft = "0xd58BCB63b33D5F6984DA687DE2e5B8c61bB0c421"
old_lnft = "0x9ab5fB83d06702D84413A837F78bFcd37FB8A3C7"
xfit_address = "0x4aa41bc1649c9c3177ed16caaa11482295fc7441"

def get_value(value):
    return value

def main(wait=False):
    number_of_premints = 404

    number_of_infts = interface.IERC721Enumerable(old_inft).totalSupply()
    
    shares = list(Multicall(
        [
            Call(old_inft, ['INFTShares(uint256)(uint256)', i+1], [(i+1, get_value)]) 
            for i in range(number_of_infts) 
        ]
    )().values())

    owners = list(Multicall(
        [
            Call(old_inft, ['ownerOf(uint256)(address)', i+1], [(i+1, get_value)]) 
            for i in range(number_of_infts) 
        ]
    )().values())

    
    correct_shares = shares[: number_of_premints]
    incorrect_shares = shares[number_of_premints :]

    intitial_reserve = 60000000000000000000000000
    actual_locked = interface.IERC20(xfit_address).balanceOf(old_lnft)
    actual_shares = []
    for share in incorrect_shares:
        xfit_staked = share * intitial_reserve / (1e18 - share)
        
        actual_share = int(xfit_staked * 1e18 / (intitial_reserve + actual_locked))
        intitial_reserve += xfit_staked
        actual_shares.append(actual_share)
    
    updated_shares = correct_shares + actual_shares

    print(updated_shares)
    print('-----')
    print(owners)
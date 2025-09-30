# Tokeni Kwa Shamba

## Introduction

Tokeni Kwa Shamba is a crowd farm funding platform that turns Kenyan farms into Investable public trading companies throught tokenized stocks.

## Application Architecture

The platform has 3 sets of wallets:
  -Farm Wallet
  -Investors Wallets
  -Tokeni Kwa Shamba (platform wallet)

We use sui coins for each farm for our toeknized stocks. With our 5 smart contracts, we are able to handle token distribution, dividend distribution and registration for wallets.




### Smart Contracts
There business logic is made up of 5 smart contracts:
#### 1. Launching a sui coin:
A farms stocks is represented with a sui coin. Once a farm is approved for setup investemnt, a coin is launched, with tokeni kwa shamba as the controller and the distribution as follows.

check sui docs here on how to launch a coin: https://github.com/MystenLabs/sui/blob/805e102c79c08c136d9eefb11f523b1d1a51c707/docs/content/guides/developer/coin.mdx
 ##### - distribution
10% of the ownership belongs to tokeni kwa shamba as platform fee. The farmer will own 60% and 30% open for investment. 

Beyond the mvp scope, the farmer's 60% will have 30% as locked liquidity, and the other 30% for financing. 
 ##### -staking & locking in:
For Stock stability & for  Dividends insurance 

  
#### 2. registration & authentication
  -credentials of farmer
  - credentials of farm
  -credentials of investor

  A dui wallet will be used for both authentication & handling finances.

#### 3. setup investment
  -financial report.
A farm submits their financial documents and records to tokeni kwa shamba via email. agoyamike@gmail.com, for a financial audit, and to determine the correct token settings.

After the admin improves, the farm is now eligible to run contract 1.


#### 4. Exit strategy
 -minimum amount of cashback entitled to an investor incase they want out.
 This is beyond the mvp scope at the moment

#### 5. Dividends
  -Frequence & period for dividend disbursment
  -The percentages of the profit for distribution and the distribution model are all set transparently in the smart contracts.
  
##### pseudocode: 
            list of wallets
            loop, send usdt/sui
            according to profits
            according to the 
            dis-tribution weights


In future we intend to do all the post mvp improvements  listed within  the docs and to add whitelisting and blacklisting through SUIs DenyList and Regulated coin

We will also integrate globally pausing and unpausing regulated coin activity for extra Administration and financial control


Thank you for reading. You can check the proof of concept at: https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/

The journey is long but we are here to make it thru thanks for reading!


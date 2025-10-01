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

For Stock stability & for Dividends insurance

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

In future we intend to do all the post mvp improvements listed within the docs and to add whitelisting and blacklisting through SUIs DenyList and Regulated coin

We will also integrate globally pausing and unpausing regulated coin activity for extra Administration and financial control

Thank you for reading. You can check the proof of concept at: https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/

The journey is long but we are here to make it thru thanks for reading!

-------------------------PROJECT REVIEW-----------------------------------

# 🌱 Mshamba - Agricultural Investment Platform

**Revolutionizing agricultural investments through blockchain technology**

Mshamba is a decentralized platform that connects farmers with investors, enabling seamless farm investment and profit sharing on the Sui blockchain.

![Mshamba Platform](https://img.shields.io/badge/Platform-Sui%20Blockchain-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Live%20Demo-orange)

## 🚀 Overview

Mshamba addresses the critical funding gap in agriculture by providing a transparent, secure platform where:

- **Farmers** can register their farms and seek investment
- **Investors** can discover farms and invest in agricultural projects
- **Smart contracts** automatically manage profit distribution
- **All transactions** are recorded on the Sui blockchain for transparency

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [Installation](#-installation)
- [Usage](#-usage)
- [Demo](#-demo)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👨‍🌾 For Farmers

- **Farm Registration**: Register farms on blockchain with metadata
- **Investment Launch**: Open farms for investment periods
- **Profit Management**: Add profits to vault for distribution
- **Automated Distribution**: 60% Farmer, 10% Platform, 30% Investors split
- **Dashboard**: Track investments, investors, and farm performance

### 💼 For Investors

- **Farm Discovery**: Browse farms seeking investment
- **Portfolio Management**: Track all investments in one dashboard
- **ROI Tracking**: Monitor returns and investment performance
- **Transparent Process**: All investments recorded on-chain
- **Secure Transactions**: Built on Sui blockchain security

### 🔧 Platform Features

- **Wallet Integration**: Support for major Sui wallets
- **Real-time Updates**: Live investment progress tracking
- **Demo Mode**: Test functionality without gas fees
- **Responsive Design**: Works on desktop and mobile
- **Professional UI**: Clean, intuitive user interface

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **@suiet/wallet-kit** - Sui wallet integration
- **@mysten/sui.js** - Sui blockchain interactions

### Blockchain

- **Sui Move** - Smart contract language
- **Sui Testnet** - Deployment environment
- **Sui Client** - CLI tools and SDK

### Development

- **JavaScript/JSX** - Frontend logic
- **CSS3** - Custom styling
- **Git** - Version control

## 🏗 Architecture

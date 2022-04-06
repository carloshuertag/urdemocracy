# urdemocracy
==================
> Project developed for GSC ESCOM IPN NEAR Protocol blockchain course.
## urdemocracy is a software tool to help decision making process in political societies focused on a participatory democracy paradigm using near protocol blockchain.

# urdemocracy lets you:
1. Create user account
2. Create collectives
3. Register Deliberations for collectives
4. Register Resources and Results for registered Delliberations.
5. Register Followups for Deliberation Results

## Pre-requisites:
1. node.js >=12 installed (https://nodejs.org)
2. yarn installed
    ```bash
    npm install --global yarn
    ```
3. install dependencias
    ```bash
    yarn install --frozen-lockfile
    ```
4. create a new account in NEAR testnet [testnet](https://docs.near.org/docs/develop/basics/create-account#creating-a-testnet-account)   
5. install NEAR CLI
    ```bash
    yarn install --global near-cli
    ```
6. authorize NEAR CLI to access your NEAR Account
    ```bash
    near login
    ```

### Clone this repository
```bash
    git clone https://github.com/huerta2502/urdemocracy
    cd urdemocracy
```

### Install project dependecies and compile the smart contract
```bash
    yarn install
    yarn build:contract:debug
```

### Deploy the contract to the NEAR testnet
```bash
    yarn dev:deploy:contract
```

### Install frontend dependeices
```bash
    yarn install
```

### Execute frontend
```bash
    yarn start
```

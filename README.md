# What to do

## Install packages
In the project directory
```shell
npm install

```
or
```shell
npm install

```

## Run test script
Doing this makes sure eveything is fine
```shell
npx hardhat test

```

# Fill in your details on a .env file following the parttern in the .env-example

## Deploy to testnet and examine all is well using the blockchain explorer
Just to be sure
```shell
npx hardhat run scripts/deploy.ts --network testnet

```

## Deploy to mainnet (We are done :)
Just to be sure
```shell
npx hardhat run scripts/deploy.ts --network bnb

```
package controller

import (
	//"bytes"
	"crypto/ecdsa"
	"crypto/ed25519"
	"crypto/rand"
	"fmt"

	//"encoding/hex"
	//config "github.com/Gravity-Tech/gravity-core/config"
	"github.com/ethereum/go-ethereum/common/hexutil"
	eth "github.com/ethereum/go-ethereum/crypto"
	"github.com/wavesplatform/go-lib-crypto"
	"log"
	"encoding/json"
)

type Keys struct {
	Validator    Key
	TargetChains map[string]Key
}

type Key struct {
	Address string
	PubKey  string
	PrivKey string
}

func (keys *Keys) Bytes() []byte {
	result, _ := json.Marshal(keys)

	return result
}

type GeneratorController struct {
	commandDelegate *CommandController
}

type GeneratedEthWallet struct {
	Address string `json:"address"`
	PrivateKey string `json:"private_key"`
	PublicKey string `json:"public_key"`
}

type GeneratedWavesWallet struct {
	Address wavesplatform.Address `json:"address"`
	PrivateKey wavesplatform.PrivateKey `json:"private_key"`
	PublicKey wavesplatform.PublicKey `json:"public_key"`
	Seed wavesplatform.Seed `json:"seed"`
}

type GeneratedWallet struct {
	Waves *GeneratedWavesWallet `json:"waves"`
	Eth *GeneratedEthWallet `json:"eth"`
	InternalConfig *internalNodeConfig `json:"internal_config"`
}

func (wallet *GeneratedWallet) Bytes() []byte {
	packed, _ := json.Marshal(wallet)

	return packed
}

type internalNodeConfig struct {
	// SEED
	Waves string `json:"waves"`
	Ethereum string `json:"ethereum"`
	Ledger string `json:"ledger"`
}


func (c *GeneratorController) generateEth() *GeneratedEthWallet {

	// Create an account
	key, _ := eth.GenerateKey()

	// Get the address
	address := eth.PubkeyToAddress(key.PublicKey).Hex()

	// Get the private key
	privateKeyBytes := eth.FromECDSA(key)

	convertedPrivateKey := hexutil.Encode(privateKeyBytes)[2:]

	publicKey := key.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("error casting public key to ECDSA")
	}

	publicKeyBytes := eth.FromECDSAPub(publicKeyECDSA)

	convertedPubKey := hexutil.Encode(publicKeyBytes)[4:]

	return &GeneratedEthWallet{
		Address:    address,
		PrivateKey: convertedPrivateKey,
		PublicKey:  convertedPubKey,
	}
}

func (c *GeneratorController) generateWaves() *GeneratedWavesWallet {
	wavesGen := wavesplatform.NewWavesCrypto()
	seed := wavesGen.RandomSeed()

	wallet := &GeneratedWavesWallet {
		PrivateKey: wavesGen.PrivateKey(seed),
		PublicKey: wavesGen.PublicKey(seed), Seed: seed }

	wallet.Address = wavesGen.AddressFromSeed(wallet.Seed, wavesplatform.MainNet)

	return wallet
}

func (c *GeneratorController) mapWalletsToInternalConfig (waves *GeneratedWavesWallet, eth *GeneratedEthWallet) *internalNodeConfig {
	// fmt.Printf("ETH Private key: %v; Length: %v; \n", eth.PrivateKey, len([]byte(eth.PrivateKey)))
	ethereumHexPrivateKey := hexutil.Encode([]byte(eth.PrivateKey))

	_, ledgerPrivateKey, _ := ed25519.GenerateKey(rand.Reader)
	ledgerHexPrivateKey := hexutil.Encode([]byte(ledgerPrivateKey))

	return &internalNodeConfig{ Waves: string(waves.Seed), Ethereum: ethereumHexPrivateKey, Ledger: ledgerHexPrivateKey }
}

func (c *GeneratorController) Generate() *Keys {
	err, initConfig := c.commandDelegate.InitLedger()

	if err != nil {
		fmt.Printf("Error on ledger init: %v \n", err.Error())
		return nil
	}

	err, _ = c.commandDelegate.RunLedger()
	if err != nil {
                fmt.Printf("Error on ledger start: %v \n", err.Error())
                return nil
        }

	return initConfig
}

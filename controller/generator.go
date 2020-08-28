package controller

import (
	"crypto/ecdsa"
	//"encoding/hex"
	"fmt"
	"github.com/ethereum/go-ethereum/common/hexutil"
	eth "github.com/ethereum/go-ethereum/crypto"
	"github.com/wavesplatform/go-lib-crypto"
	"log"
)

type GeneratorController struct {}


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
}


func (c *GeneratorController) generateEth() *GeneratedEthWallet {

	// Create an account
	key, _ := eth.GenerateKey()

	// Get the address
	address := eth.PubkeyToAddress(key.PublicKey).Hex()

	// Get the private key
	//privateKey := hex.EncodeToString(key.D.Bytes())
	privateKeyBytes := eth.FromECDSA(key)

	convertedPrivateKey := hexutil.Encode(privateKeyBytes)[2:]

	fmt.Println(convertedPrivateKey) // fad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19

	publicKey := key.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("error casting public key to ECDSA")
	}

	publicKeyBytes := eth.FromECDSAPub(publicKeyECDSA)

	convertedPubKey := hexutil.Encode(publicKeyBytes)[4:]

	fmt.Println(convertedPubKey)


	return &GeneratedEthWallet{
		Address:    address,
		PrivateKey: convertedPrivateKey,
		PublicKey:  convertedPubKey,
	}
}

func (c *GeneratorController) generateWaves() *GeneratedWavesWallet {
	wavesGen := wavesplatform.NewWavesCrypto()
	seed := wavesGen.RandomSeed()

	//fmt.Println("SEED:", seed)

	wallet := &GeneratedWavesWallet { PrivateKey: wavesGen.PrivateKey(seed), PublicKey: wavesGen.PublicKey(seed), Seed: seed }

	wallet.Address = wavesGen.AddressFromSeed(wallet.Seed, wavesplatform.MainNet)

	return wallet
}

func (c *GeneratorController) Generate() *GeneratedWallet {
	waves, eth := c.generateWaves(), c.generateEth()

	return &GeneratedWallet{ Waves: waves, Eth: eth }
}


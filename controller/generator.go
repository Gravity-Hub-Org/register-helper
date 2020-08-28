package controller

import (
	"encoding/hex"
	eth "github.com/ethereum/go-ethereum/crypto"
	"github.com/wavesplatform/go-lib-crypto"
)

type GeneratorController struct {}


type GeneratedEthWallet struct {}

type GeneratedWavesWallet struct {
	PrivateKey wavesplatform.PrivateKey `json:"private_key"`
	PublicKey wavesplatform.PublicKey `json:"public_key"`
	Seed wavesplatform.Seed `json:"seed"`
}

type GeneratedWallet struct {
	Waves *GeneratedWavesWallet `json:"waves"`
}


func (c *GeneratorController) generateEth() {

	// Create an account
	key, _ := eth.GenerateKey()

	// Get the address
	address := eth.PubkeyToAddress(key.PublicKey).Hex()
	// 0x8ee3333cDE801ceE9471ADf23370c48b011f82a6

	// Get the private key
	privateKey := hex.EncodeToString(key.D.Bytes())
	// 05b14254a1d0c77a49eae3bdf080f926a2df17d8e2ebdf7af941ea001481e57f
}
func (c *GeneratorController) generateWaves() {}

func (c *GeneratorController) Generate() *GeneratedWallet {
	wavesGen := wavesplatform.NewWavesCrypto()
	seed := wavesGen.RandomSeed()

	//fmt.Println("SEED:", seed)

	waves := &GeneratedWavesWallet { PrivateKey: wavesGen.PrivateKey(seed), PublicKey: wavesGen.PublicKey(seed), Seed: seed }

	return &GeneratedWallet{ Waves: waves }
}


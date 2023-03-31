package main

import (
	"context"
	"fmt"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/contracts/token/erc721"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-gonic/gin"
	"github.com/syndtr/goleveldb/leveldb"
)

type TransferLog struct {
	From    string `json:"from"`
	To      string `json:"to"`
	TokenId string `json:"tokenId"`
}

func main() {
	r := gin.Default()

	client, err := ethclient.Dial("https://eth-mainnet.g.alchemy.com/v2/Dq78e8UbqncjWWZR48s5mNqvBJNw1Vri")
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()
	contractAddress := common.HexToAddress("0x123456...")
	filterOpts := &bind.FilterOpts{Start: 0, End: nil, Context: context.Background()}
	contractInstance, err := erc721.NewERC721(contractAddress, client)
	if err != nil {
		log.Fatal(err)
	}

	transferEventSignature := []byte("Transfer(address,address,uint256)")
	transferEventHash := crypto.Keccak256Hash(transferEventSignature)
	query := ethereum.FilterQuery{
		Addresses: []common.Address{contractAddress},
		Topics:    [][]common.Hash{{transferEventHash}},
	}
	logs, err := client.FilterLogs(filterOpts, query)
	if err != nil {
		log.Fatal(err)
	}

	for _, log := range logs {
		event := struct {
			From    common.Address
			To      common.Address
			TokenId *big.Int
		}{}
		err := contractInstance.UnpackLog(&event, "Transfer", log)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("Transfer event: from=%s to=%s tokenId=%s", event.From.Hex(), event.To.Hex(), event.TokenId.String())
	}

	db, err := leveldb.OpenFile("./nft-transfer.db", nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	value, err := db.Get([]byte("users"), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(value))

	err = db.Put([]byte("users"), []byte("John Doe"), nil)
	if err != nil {
		log.Fatal(err)
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.Run() // 监听并在 0.0.0.0:8080 上启动服务
}

package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var db = make(map[string]string)

// var sqliteDB *sql.DB

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	// Get user value
	r.GET("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		value, ok := db[user]
		if ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "value": value})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "status": "no value"})
		}
	})

	// Authorized group (uses gin.BasicAuth() middleware)
	// Same than:
	// authorized := r.Group("/")
	// authorized.Use(gin.BasicAuth(gin.Credentials{
	//	  "foo":  "bar",
	//	  "manu": "123",
	//}))
	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		"foo":  "bar", // user:foo password:bar
		"manu": "123", // user:manu password:123
	}))

	/* example curl for /admin with basicauth header
	   Zm9vOmJhcg== is base64("foo:bar")

		curl -X POST \
	  	http://localhost:8080/admin \
	  	-H 'authorization: Basic Zm9vOmJhcg==' \
	  	-H 'content-type: application/json' \
	  	-d '{"value":"bar"}'
	*/
	authorized.POST("admin", func(c *gin.Context) {
		user := c.MustGet(gin.AuthUserKey).(string)

		// Parse JSON
		var json struct {
			Value string `json:"value" binding:"required"`
		}

		if c.Bind(&json) == nil {
			db[user] = json.Value
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		}
	})

	return r
}

func insertDB(sqliteDB *sql.DB) {
	result, err := sqliteDB.Exec("INSERT INTO transfer_log (from, to,tokenId) VALUES (?, ?,?)", "0x0000", "0x1111", "1")
	if err != nil {
		log.Fatal(err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted row with ID:", id)

}

func initDB(sqliteDB *sql.DB) {
	rows, err := sqliteDB.Query("SELECT name FROM sqlite_master WHERE type='table' AND name='transfer_log'")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	if rows.Next() {
		fmt.Println("Table transfer_log already exists")
	} else {

		// 初始化数据表
		_, err = sqliteDB.Exec("CREATE TABLE transfer_log (id INTEGER PRIMARY KEY, from TEXT, to TEXT,tokenId TEXT)")
		if err != nil {
			log.Fatal(err)
		}
	}
}

func queryData(sqliteDB *sql.DB) {
	rows, err := sqliteDB.Query("SELECT * FROM transfer_log")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var from string
		var to string
		var tokenId string
		err = rows.Scan(&id, &from, &to, &tokenId)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(id, from, to, tokenId)
	}
}

func main1() {
	sqliteDB, err := sql.Open("sqlite3", "./nft-transfer.s3db")
	if err != nil {
		log.Fatal(err)
	}
	defer sqliteDB.Close()

	// 初始化表
	initDB(sqliteDB)

	insertDB(sqliteDB)

	queryData(sqliteDB)

	r := setupRouter()

	r.Run(":8080")
}

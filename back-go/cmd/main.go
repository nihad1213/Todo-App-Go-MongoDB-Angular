package main

import (
	"fmt"
	"back-go/config"
)

func main() {
	secret := config.GenerateSecretKey()
	fmt.Println(secret)
}

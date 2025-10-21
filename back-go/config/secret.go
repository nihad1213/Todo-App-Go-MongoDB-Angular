package config

// Generate Secret Key

import (
	"crypto/rand"
	"encoding/base64"
	"log"
)

func GenerateSecretKey() string {
	secret := make([]byte, 32)
	_, err := rand.Read(secret)
	
	if err != nil {
		log.Fatal("Error generating secret key: ", err)
	}
	
	return base64.StdEncoding.EncodeToString(secret)
}


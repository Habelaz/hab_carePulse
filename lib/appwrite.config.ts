import * as sdk from "node-appwrite"

export const {
    PROJECT_ID, API_KEY, DATABASE_ID, PATIENT_COLLECTION_ID, DOCTOR_COLLECTION_ID,APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID:BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT :ENDPOINT
} = process.env

const client = new sdk.Client()

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67223dce003992d7e364")
    .setKey("standard_2a52fdc55485ee21f1ca57bd5233a3e42b9ed050c9ecbf3806c34d9745031eee5c5a6c44050c08ed60705dd7877dc42dcf72fb7c37832c7688d807dafaee50e567b99401a39bc17f778a335e794604aaeba401a89c55010beb2b7abc4c3ecefc9e23c776d52b775379204857b3908cd94132727121cb5fcd9308c418f0598474");

export const databases = new sdk.Databases(client)
export const storage = new sdk.Storage(client)
export const messaging = new sdk.Messaging(client)
export const users = new sdk.Users(client) 

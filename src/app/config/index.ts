import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.join((process.cwd(),'.env'))})

export default {
    port: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.bcrypt_salt_rounds,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefressSecret: process.env.JWT_Refress_SECRET,
    JWT_ACCESS_EXPIRES_IN:process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESS_EXPIRES_IN:process.env.JWT_REFRESS_EXPIRES_IN,
    meilisearch_Host:process.env.meilisearch_host,
    meilisearch_api_key:process.env.meilisearch_api_key,
    nodeEnv:process.env.NODE_ENV,
    reset_link:process.env.reset_Link,
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_Api_Key,
    secret_key:process.env.CLOUDINARY_Api_Secret
}
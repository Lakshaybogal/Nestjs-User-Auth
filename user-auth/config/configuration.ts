export default () => ({

    jwt: {
        access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        access_expiration: parseInt(process.env.JWT_ACCESS_TOKEN_AGE),
        refresh_expiration: parseInt(process.env.JWT_REFRESH_TOKEN_AGE)
    }
})


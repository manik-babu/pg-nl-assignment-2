import app from './app';
import config from './config';

const port = Number(config.port) || 8080;

app.listen(port, () => {
    console.log("Server running...");
})
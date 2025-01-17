import app from "./app.js";
import { connectDB } from "./db/dbClient.js";
connectDB()
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
    .catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map
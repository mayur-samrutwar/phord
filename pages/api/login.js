// pages/api/login.js
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { walletAddress } = req.body;

    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_MONGODB_URI
    );
    const db = client.db(`${process.env.NEXT_PUBLIC_MONGODB_DB}`);
    const users = db.collection("users");

    try {
        let user = await users.findOne({ walletAddress });

        if (!user) {
          // If user doesn't exist, create a new one
          user = {
            walletAddress,
            createdAt: new Date(),
            // Add any other initial user data
          };
          await users.insertOne(user);
        }

      res.status(200).json({ kok: "kok" });
    } catch (error) {
      res.status(500).json({ error: "Error processing request" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

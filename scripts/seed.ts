import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import type { OrderStatus } from "../lib/constants";
import { connectDB } from "../lib/mongodb";
import { priceForTier, roundMoney } from "../lib/pricing";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";

const PASSWORD = "password123";

const users = [
  {
    companyName: "Kavara Roasters HQ",
    email: "admin@kavara.com",
    role: "ADMIN",
    tier: "BRONZE",
  },
  {
    companyName: "Gold Leaf Café",
    email: "cafe@gold.com",
    role: "CLIENT",
    tier: "GOLD",
  },
  {
    companyName: "Silver Spoon Espresso Bar",
    email: "cafe@silver.com",
    role: "CLIENT",
    tier: "SILVER",
  },
  {
    companyName: "Bronze Kettle Coffee House",
    email: "cafe@bronze.com",
    role: "CLIENT",
    tier: "BRONZE",
  },
  {
    companyName: "Harbour Street Roastery Café",
    email: "harbour@example.com",
    role: "CLIENT",
    tier: "SILVER",
  },
  {
    companyName: "Juniper & Rye Bakery",
    email: "juniper@example.com",
    role: "CLIENT",
    tier: "BRONZE",
  },
] as const;

// Product photos (originally from Unsplash) hosted in this project's
// UploadThing bucket.
const hosted = (key: string) => `https://aykgnp0fg0.ufs.sh/f/${key}`;

const ETHIOPIAN = "Ethiopian Yirgacheffe Single Origin";
const SUMATRA = "Sumatra Dark Reserve";
const COLOMBIA = "Colombia Huila Supremo";
const GUATEMALA = "Guatemala Antigua Volcanic";
const KENYA = "Kenya AA Nyeri Peaberry";

const products = [
  {
    name: ETHIOPIAN,
    origin: "Yirgacheffe, Ethiopia",
    roastLevel: "Light",
    basePrice: 24.5,
    moqKg: 1,
    imageUrl: hosted("DdYxBK68GeB7no57Z0LLfPsm1xCtM2oAbpUB96RZgDaK5G0r"),
  },
  {
    name: SUMATRA,
    origin: "Aceh, Sumatra",
    roastLevel: "Dark",
    basePrice: 19,
    moqKg: 2,
    imageUrl: hosted("DdYxBK68GeB7uvwgMUZ88knv5aF6Xt3mdbgihP2y41QoMBAU"),
  },
  {
    name: COLOMBIA,
    origin: "Huila, Colombia",
    roastLevel: "Medium",
    basePrice: 21,
    moqKg: 1,
    imageUrl: hosted("DdYxBK68GeB7bn47t2zsEK53BmxISMCYZyGpVH0tPuUd9ahz"),
  },
  {
    name: GUATEMALA,
    origin: "Antigua, Guatemala",
    roastLevel: "Medium-Dark",
    basePrice: 22.5,
    moqKg: 1,
    imageUrl: hosted("DdYxBK68GeB77csG8aQJfjKPrkBqF1W4DbIeCdut0zsZOH3p"),
  },
  {
    name: KENYA,
    origin: "Nyeri, Kenya",
    roastLevel: "Light",
    basePrice: 27,
    moqKg: 1,
    imageUrl: hosted("DdYxBK68GeB7IjHx9PldbaouwONgke41D5VYSQzBWlJ2sqn6"),
  },
] as const;

type SeedOrder = {
  /** Fixed id, so re-running the seed finds the order instead of duplicating it. */
  id: string;
  client: (typeof users)[number]["email"];
  placedOn: string;
  status: OrderStatus;
  /** Product name and kilograms. */
  lines: [name: (typeof products)[number]["name"], kg: number][];
};

const seedId = (n: number) => `5eed${n.toString(16).padStart(20, "0")}`;

// Every order totals at least 5kg and respects each product's own minimum.
const orders: SeedOrder[] = [
  {
    id: seedId(1),
    client: "cafe@gold.com",
    placedOn: "2026-08-04",
    status: "SHIPPED",
    lines: [
      [ETHIOPIAN, 6],
      [COLOMBIA, 4],
    ],
  },
  {
    id: seedId(2),
    client: "cafe@silver.com",
    placedOn: "2026-08-11",
    status: "SHIPPED",
    lines: [
      [SUMATRA, 4],
      [GUATEMALA, 3],
    ],
  },
  {
    id: seedId(3),
    client: "cafe@bronze.com",
    placedOn: "2026-08-19",
    status: "SHIPPED",
    lines: [[COLOMBIA, 5]],
  },
  {
    id: seedId(4),
    client: "harbour@example.com",
    placedOn: "2026-08-27",
    status: "SHIPPED",
    lines: [
      [KENYA, 3],
      [ETHIOPIAN, 3],
      [SUMATRA, 2],
    ],
  },
  {
    id: seedId(5),
    client: "cafe@gold.com",
    placedOn: "2026-09-02",
    status: "SHIPPED",
    lines: [
      [KENYA, 5],
      [GUATEMALA, 5],
      [SUMATRA, 6],
    ],
  },
  {
    id: seedId(6),
    client: "juniper@example.com",
    placedOn: "2026-09-09",
    status: "SHIPPED",
    lines: [
      [COLOMBIA, 3],
      [GUATEMALA, 2],
    ],
  },
  {
    id: seedId(7),
    client: "cafe@silver.com",
    placedOn: "2026-09-16",
    status: "INVOICED",
    lines: [
      [ETHIOPIAN, 4],
      [KENYA, 2],
    ],
  },
  {
    id: seedId(8),
    client: "cafe@bronze.com",
    placedOn: "2026-09-24",
    status: "INVOICED",
    lines: [
      [SUMATRA, 3],
      [COLOMBIA, 3],
    ],
  },
  {
    id: seedId(9),
    client: "harbour@example.com",
    placedOn: "2026-09-30",
    status: "INVOICED",
    lines: [[GUATEMALA, 8]],
  },
  {
    id: seedId(10),
    client: "cafe@gold.com",
    placedOn: "2026-10-05",
    status: "PENDING",
    lines: [
      [ETHIOPIAN, 8],
      [SUMATRA, 4],
    ],
  },
  {
    id: seedId(11),
    client: "juniper@example.com",
    placedOn: "2026-10-07",
    status: "PENDING",
    lines: [
      [KENYA, 2],
      [COLOMBIA, 4],
    ],
  },
  {
    id: seedId(12),
    client: "cafe@silver.com",
    placedOn: "2026-10-08",
    status: "PENDING",
    lines: [
      [GUATEMALA, 5],
      [SUMATRA, 2],
      [KENYA, 1],
    ],
  },
];

async function seed() {
  await connectDB();
  const password = await bcrypt.hash(PASSWORD, 10);

  // Users and products are upserts keyed on email / name: safe to re-run, and
  // nothing else in those collections is touched.
  for (const user of users) {
    await User.findOneAndUpdate(
      { email: user.email },
      { ...user, password },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    console.log(`  user     ${user.email} (${user.role}, ${user.tier})`);
  }

  for (const product of products) {
    await Product.findOneAndUpdate({ name: product.name }, product, {
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    console.log(`  product  ${product.name}`);
  }

  // Orders are only inserted when missing, so a status an admin has changed
  // since survives a re-run.
  const [clientDocs, productDocs] = await Promise.all([
    User.find({ email: { $in: users.map((user) => user.email) } }).lean(),
    Product.find({ name: { $in: products.map((p) => p.name) } }).lean(),
  ]);
  const clientByEmail = new Map(clientDocs.map((doc) => [doc.email, doc]));
  const productByName = new Map(productDocs.map((doc) => [doc.name, doc]));

  let inserted = 0;
  for (const order of orders) {
    const client = clientByEmail.get(order.client)!;
    const items = order.lines.map(([name, quantity]) => {
      const product = productByName.get(name)!;
      return {
        productId: product._id,
        quantity,
        priceAtPurchase: priceForTier(product.basePrice, client.tier),
      };
    });
    const totalAmount = roundMoney(
      items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0)
    );
    const placedAt = new Date(`${order.placedOn}T10:00:00Z`);

    const result = await Order.updateOne(
      { _id: order.id },
      {
        $setOnInsert: {
          clientId: client._id,
          items,
          totalAmount,
          status: order.status,
          createdAt: placedAt,
          updatedAt: placedAt,
        },
      },
      { upsert: true, timestamps: false }
    );
    if (result.upsertedCount > 0) inserted++;
    console.log(
      `  order    ${order.placedOn}  ${order.client.padEnd(20)} ${order.status.padEnd(8)} $${totalAmount.toFixed(2)}`
    );
  }

  console.log(
    `\nSeeded ${users.length} users, ${products.length} products and ${orders.length} orders (${inserted} new).`
  );
  console.log(`Log in with any seeded email and the password "${PASSWORD}".`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

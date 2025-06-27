import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }
    // ✅ Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "Invalid file type" }, { status: 400 });
    }

    // Convert to Buffer
    const arrayBuffer = await file.arrayBuffer(); // Web-style raw binary
    const buffer = Buffer.from(arrayBuffer); // Node.js style binary

    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    // Save file to disk
    await fs.promises.writeFile(filePath, buffer);

    // 👇 Construct full URL
    const host = req.headers.get("host"); // e.g., localhost:3000
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const imageUrl = `${protocol}://${host}/uploads/${filename}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

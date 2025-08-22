import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const {
      name,
      description,
      price,
      tags,
      type,
      categoryId,
      segment,
      companyId,
      images,
      inStock,
      stockStatus,
      resolution,
      nightVision,
      weatherProtection,
      storage,
      power,
      warranty,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        tags: Array.isArray(tags)
          ? tags
          : typeof tags === "string"
          ? tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : undefined,
        type,
        categoryId,
        companyId,
        images: Array.isArray(images)
          ? images
          : typeof images === "string"
          ? images
              .split(",")
              .map((i: string) => i.trim())
              .filter(Boolean)
          : undefined,
        inStock,
        stockStatus,
        resolution,
        nightVision,
        weatherProtection,
        storage,
        power,
        warranty,
      },
      include: {
        category: {
          select: { id: true, name: true, type: true, segment: true },
        },
        company: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

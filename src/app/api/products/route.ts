import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { id: true, name: true, type: true } },
        company: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    } = body;

    if (!name || !description || !price || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If no categoryId provided, attempt to resolve by type+segment
    let resolvedCategoryId = categoryId as string | undefined;
    if (!resolvedCategoryId && type && segment) {
      const found = await prisma.category.findFirst({
        where: { type, segment },
        select: { id: true },
      });
      if (found) {
        resolvedCategoryId = found.id;
      } else {
        const created = await prisma.category.create({
          data: {
            name: `${type} - ${segment}`,
            description: `${segment} ${type.toLowerCase()} category`,
            type,
            segment,
          },
          select: { id: true },
        });
        resolvedCategoryId = created.id;
      }
    }

    const created = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        tags: Array.isArray(tags)
          ? tags
          : typeof tags === "string" && tags
          ? tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
        type,
        categoryId: resolvedCategoryId ?? categoryId,
        companyId,
        images: Array.isArray(images)
          ? images
          : typeof images === "string" && images
          ? images
              .split(",")
              .map((i: string) => i.trim())
              .filter(Boolean)
          : [],
        inStock: Boolean(inStock),
        stockStatus,
      },
      include: {
        category: { select: { id: true, name: true, type: true } },
        company: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

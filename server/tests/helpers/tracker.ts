import { prisma } from "../../src/lib/prisma.ts";

const run = async (fn: () => Promise<void>) => {
  await fn();
};

export class CleanupTracker {
  userIds: string[] = [];
  categoryIds: string[] = [];
  brandIds: string[] = [];
  productIds: string[] = [];
  variantIds: string[] = [];
  warehouseIds: string[] = [];
  inventoryIds: string[] = [];
  couponIds: string[] = [];
  orderIds: string[] = [];
  paymentIds: string[] = [];
  webhookLogIds: string[] = [];
  cartIds: string[] = [];

  async cleanup() {
    const orders = [...this.orderIds];
    const payments = [...this.paymentIds];
    const variants = [...this.variantIds];
    const products = [...this.productIds];
    const users = [...this.userIds];
    const coupons = [...this.couponIds];
    const warehouses = [...this.warehouseIds];
    const inventories = [...this.inventoryIds];
    const carts = [...this.cartIds];
    const webhookLogs = [...this.webhookLogIds];
    const categories = [...this.categoryIds];
    const brands = [...this.brandIds];

    try {
      if (payments.length) {
        await run(async () => {
          await prisma.refund.deleteMany({
            where: { paymentId: { in: payments } },
          });
          await prisma.paymentTransaction.deleteMany({
            where: { paymentId: { in: payments } },
          });
          await prisma.paymentEvent.deleteMany({
            where: { paymentId: { in: payments } },
          });
        });
      }

      if (orders.length) {
        const extraPayments = await prisma.payment.findMany({
          where: { orderId: { in: orders } },
          select: { id: true },
        });
        const extraIds = extraPayments.map((p) => p.id);
        if (extraIds.length) {
          await prisma.refund.deleteMany({
            where: { paymentId: { in: extraIds } },
          });
          await prisma.paymentTransaction.deleteMany({
            where: { paymentId: { in: extraIds } },
          });
          await prisma.paymentEvent.deleteMany({
            where: { paymentId: { in: extraIds } },
          });
          await prisma.payment.deleteMany({ where: { id: { in: extraIds } } });
        }

        await prisma.couponUsage.deleteMany({
          where: { orderId: { in: orders } },
        });
        await prisma.stockReservation.deleteMany({
          where: { orderId: { in: orders } },
        });
        await prisma.orderEvent.deleteMany({
          where: { orderId: { in: orders } },
        });
        await prisma.orderStatusHistory.deleteMany({
          where: { orderId: { in: orders } },
        });
        await prisma.orderItem.deleteMany({ where: { orderId: { in: orders } } });
        await prisma.billingAddress.deleteMany({
          where: { orderId: { in: orders } },
        });
        await prisma.shippingAddress.deleteMany({
          where: { orderId: { in: orders } },
        });
        await prisma.order.deleteMany({ where: { id: { in: orders } } });
      }

      if (payments.length) {
        await prisma.payment.deleteMany({ where: { id: { in: payments } } });
      }

      if (webhookLogs.length) {
        await prisma.paymentWebhookLog.deleteMany({
          where: { id: { in: webhookLogs } },
        });
      }

      if (coupons.length) {
        await prisma.couponUsage.deleteMany({
          where: { couponId: { in: coupons } },
        });
        await prisma.coupon.deleteMany({ where: { id: { in: coupons } } });
      }

      if (carts.length) {
        await prisma.cartCoupon.deleteMany({ where: { cartId: { in: carts } } });
        await prisma.cartActivity.deleteMany({
          where: { cartId: { in: carts } },
        });
        await prisma.cartItem.deleteMany({ where: { cartId: { in: carts } } });
        await prisma.cart.deleteMany({ where: { id: { in: carts } } });
      }

      if (inventories.length) {
        await prisma.inventoryTransaction.deleteMany({
          where: { inventoryId: { in: inventories } },
        });
        await prisma.inventory.deleteMany({
          where: { id: { in: inventories } },
        });
      }

      if (variants.length) {
        await prisma.inventoryEvent.deleteMany({
          where: { variantId: { in: variants } },
        });
        await prisma.inventoryTransaction.deleteMany({
          where: { variantId: { in: variants } },
        });
        await prisma.inventory.deleteMany({
          where: { variantId: { in: variants } },
        });
        await prisma.cartItem.deleteMany({
          where: { variantId: { in: variants } },
        });
        await prisma.productVariant.deleteMany({
          where: { id: { in: variants } },
        });
      }

      if (products.length) {
        await prisma.productImage.deleteMany({
          where: { productId: { in: products } },
        });
        await prisma.product.deleteMany({ where: { id: { in: products } } });
      }

      if (categories.length) {
        await prisma.category.deleteMany({ where: { id: { in: categories } } });
      }

      if (brands.length) {
        await prisma.brand.deleteMany({ where: { id: { in: brands } } });
      }

      if (warehouses.length) {
        await prisma.inventory.deleteMany({
          where: { warehouseId: { in: warehouses } },
        });
        await prisma.warehouse.deleteMany({
          where: { id: { in: warehouses } },
        });
      }

      if (users.length) {
        const profiles = await prisma.customerProfile.findMany({
          where: { userId: { in: users } },
          select: { id: true },
        });
        const profileIds = profiles.map((p) => p.id);
        if (profileIds.length) {
          const leftoverCarts = await prisma.cart.findMany({
            where: { customerProfileId: { in: profileIds } },
            select: { id: true },
          });
          const leftoverCartIds = leftoverCarts.map((c) => c.id);
          if (leftoverCartIds.length) {
            await prisma.cartCoupon.deleteMany({
              where: { cartId: { in: leftoverCartIds } },
            });
            await prisma.cartActivity.deleteMany({
              where: { cartId: { in: leftoverCartIds } },
            });
            await prisma.cartItem.deleteMany({
              where: { cartId: { in: leftoverCartIds } },
            });
            await prisma.cart.deleteMany({
              where: { id: { in: leftoverCartIds } },
            });
          }
          await prisma.couponUsage.deleteMany({
            where: { customerProfileId: { in: profileIds } },
          });
          await prisma.customerProfile.deleteMany({
            where: { id: { in: profileIds } },
          });
        }
        await prisma.session.deleteMany({ where: { userId: { in: users } } });
        await prisma.account.deleteMany({ where: { userId: { in: users } } });
        await prisma.user.deleteMany({ where: { id: { in: users } } });
      }
    } finally {
      this.userIds = [];
      this.categoryIds = [];
      this.brandIds = [];
      this.productIds = [];
      this.variantIds = [];
      this.warehouseIds = [];
      this.inventoryIds = [];
      this.couponIds = [];
      this.orderIds = [];
      this.paymentIds = [];
      this.webhookLogIds = [];
      this.cartIds = [];
    }
  }
}

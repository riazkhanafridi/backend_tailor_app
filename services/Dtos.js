
export const customerDTO = (data) => {
  const {
    customerId,
    email,
    full_name,
 
  } = data;
  return {
   customerId,
    email,
    full_name,
  };
};

export const userDTO = (data) => {
  const {
    userId,
    email,
    full_name,
    phone,
    status,
    role,
 
  } = data;
  return {
    userId,
    email,
    full_name,
    phone,
    status,
    role,
  
  };
};








// export const expenseDTO = (data) => {
//   const { expenseId, title, amount, Item, User, createdAt, updatedAt } = data || {};
//   return {
//     expenseId,
//     title,
//     amount,
//       item: Item ? { itemId: Item.itemId, name: Item.name } : null,
//     addEditBy: User ? { userId: User.userId, fullName: User.fullName } : null,
//     createdAt,
//     updatedAt,
//   };
// };
export const expenseDTO = (data) => {
  const { expenseId, title, amount, Item, User, createdAt, updatedAt } = data;
  return {
    expenseId,
    title,
    amount,
    item: Item ? { itemId: Item.itemId, name: Item.name } : null,
    addEditBy: User ? { userId: User.userId, fullName: User.fullName } : null,
    createdAt,
    updatedAt,
  };
};

export const salaryDTO = (data) => {
  const {
    salaryId,
    userId,
    month,
    year,
    status,
    
    comment,
    paidAmount,
    createdAt,
    updatedAt,
    User,
  } = data;

  return {
    salaryId,
    userId,
    month,
    
    year,
    status,
    comment,
    paidAmount,
    createdAt,
    updatedAt,
     remianingAmount: User ? Number(User.salary) - paidAmount : null,
    user: User
      ? {
          userId: User.userId,
          fullName: User.fullName,
          role: User.role,
          phone: User.phone,
          salary: User.salary,
        }
      : null,
  };
};


export const inventoryDTO = (inv) => ({
  inventoryId: inv.inventoryId,
  supplierId: inv.supplierId,
  name: inv.name,
  stockStatus: inv.stockStatus,
  stock: inv.stock,
  Unit: inv.Unit,
  batchNumber: inv.batchNumber,
  expiryDate: inv.expiryDate,

  Supplier: inv.Supplier
    ? {
        supplierId: inv.Supplier.supplierId,
        name: inv.Supplier.name,
        phone: inv.Supplier.phone,
        address: inv.Supplier.address,
      }
    : null,
});


export const orderDTO = (order, itemDetailsMap) => {
  const orderItems = Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]");

  const itemsWithDetails = orderItems.map((oi) => {
    const details = itemDetailsMap[oi.itemId];

    return {
      itemId: oi.itemId,
      quantity: oi.quantity,
      price: oi.price,
      name: details?.name || null,
      image: details?.image || null,
      description: details?.description || null,
    };
  });

  return { orderData: { ...order.toJSON(), items: itemsWithDetails } };
};


// export const orderWithItemsDTO = (order, itemsDetails) => {
//   const orderObj = order.toJSON();

//   const orderItems =
//     typeof orderObj.items === "string"
//       ? JSON.parse(orderObj.items || "[]")
//       : orderObj.items || [];

//   orderObj.items = orderItems.map((oi) => {
//     const details = itemsDetails.find((i) => i.itemId === Number(oi.itemId));
//     return {
//       ...oi,
//       name: details?.name || null,
//       image: details?.image || null,
//     };
//   });

//   return orderObj;
// };

export const orderWithItemsDTO = (order, itemsMap, customer = null) => {
  const orderItems =
    typeof order.items === "string"
      ? JSON.parse(order.items || "[]")
      : order.items || [];

  return {
    orderId: order.orderId,
    items: orderItems.map(item => {
      const itemDetails = itemsMap[item.itemId] || {};
      
      // Find the specific variant used in this order
      let variantDetails = null;
      if (item.varientId && itemDetails.variants) {
        variantDetails = itemDetails.variants.find(
          v => v.varientId === item.varientId
        );
      }

      return {
        itemId: item.itemId,
        name: itemDetails.name || 'Unknown Item',
        image: itemDetails.image,
        quantity: item.quantity,
        // price: item.price, // Price from order (should be from variant)
        // size: item.size || variantDetails?.size || null, // Size from order or variant
        // varientId: item.varientId || null,
        variant: variantDetails || (item.varientId ? {
          varientId: item.varientId,
          size: item.size,
          price: item.price
        } : null),
        itemTotal: item.price * item.quantity
      };
    }),
    // customerId: order.customerId,
    customer: customer ? {
      customerId: customer.customerId,
      name: customer.name,
      phone: customer.phone
    } : null,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    tableNo: order.tableNo,
    description: order.description,
    date: order.date,
    time: order.time,
    paymentMethod: order.paymentMethod,
    discount: order.discount,
    subTotal: order.subTotal,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
};
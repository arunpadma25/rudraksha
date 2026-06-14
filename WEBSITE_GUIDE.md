# Rudraksha Sacred Store — Website Guide

*A simple, non-technical overview of your online store and how to run it.*

---

## 1. What is this website?

This is your own **online rudraksha store**. Customers anywhere in the world can browse your
home-grown, organic rudraksha beads, see prices in their own currency, and place orders — paying
online or by cash on delivery. You manage everything (products, photos, orders) yourself through a
private **Admin Panel**.

**Your brand story is built in:** the home page and "About" page highlight that your beads are
*home-grown on your own family farm near Mangalore, Karnataka — 100% organic and hand-harvested.*

---

## 2. What your customers can do

- **Browse & search** all rudraksha beads (1 Mukhi to 14 Mukhi and special beads).
- **See prices in their currency** — Indian Rupee, US Dollar, Euro, Pound, Dirham, and more. They
  switch currency from the top of the page.
- **View product details** — photos, benefits, ruling planet, deity, and mantra.
- **Save favourites** to a wishlist (heart icon).
- **Read & write reviews** with star ratings (customers must create an account to review).
- **Add to cart** and check out securely (they must log in / create an account to order).
- **Pay online or choose Cash on Delivery.**
- **Track their orders** in their account.
- **Chat with you on WhatsApp** using the green button at the bottom of every page.

---

## 3. Managing your store (Admin Panel)

### Logging in
1. Go to **yourwebsite.com/admin** (during testing: `http://localhost:3000/admin`).
2. Log in with your **admin** account.
   - Default during testing: **admin@rudraksha.test** / **admin12345**
   - *(Please change this before going live.)*

### Dashboard
The first screen shows your **products count, total orders, revenue, and low-stock alerts**, plus
recent orders.

### Managing products
Go to **Admin → Products**.
- **Add a product**: click **+ Add Product**, fill in the name, description, benefits, price (in
  INR), stock, and spiritual details.
- **Photos**: under **Product images** you can:
  - **Upload multiple photos** at once.
  - **Crop & zoom** each photo to a neat square.
  - **Star** one photo to make it the **default** (the one shown first).
  - Reorder or remove photos.
  - *If you don't upload a photo, the site shows a nice auto-generated bead image.*
- **Featured**: tick "Featured" to show a product on the home page.
- **Active**: untick "Active" to hide a product from the store without deleting it.
- **Edit / Delete**: use the buttons next to each product.

> Prices are entered in **Indian Rupees (₹)**. The website automatically converts them to other
> currencies for international customers.

### Managing orders
Go to **Admin → Orders**.
- See every order with the customer's details, items, and shipping address.
- **Update the status** using the dropdown: Pending → Paid → Shipped → Delivered (or Cancelled),
  then click **Update**.

---

## 4. Payments

Your store supports two ways for customers to pay:

1. **Cash on Delivery (COD)** — works immediately, no setup.
2. **Online payment (cards / UPI / netbanking)** — powered by **Razorpay**.

**Right now**, online payment runs in a safe **test/demo mode** (no real money) so everything can be
tried end-to-end. To accept **real** online payments:
1. Create a **free Razorpay account** (no monthly fee; they only take a small per-transaction fee).
2. Complete their KYC (business + bank details).
3. We add your Razorpay keys to the website's settings and switch it on.

> Online payments are charged in **Indian Rupees**. Cash on Delivery works in any currency.

---

## 5. WhatsApp "Chat with us"

A green WhatsApp button appears at the bottom of every page. Tapping it opens a chat with your
number (**+91 94877 89546**) so customers can ask questions quickly. The number can be changed any
time.

---

## 6. Shipping

- **India**: free shipping over ₹2,500; otherwise a small flat fee.
- **International**: a flat shipping fee.

These amounts can be adjusted easily on request.

---

## 7. Accounts (for testing)

| Role     | Email                       | Password        |
| -------- | --------------------------- | --------------- |
| Admin    | admin@rudraksha.test        | admin12345      |
| Customer | customer@rudraksha.test     | customer12345   |

*Please change the admin password before the site goes live.*

---

## 8. Before going live (what's still needed)

These are the remaining steps to take the store fully live (your developer will handle the technical
parts):

1. **Hosting & domain** — put the site online at your own web address (e.g. `yourbrand.com`).
2. **Database upgrade** — move to a production database so data is safe and scalable.
3. **Product photos** — upload real photos of your beads and farm (the home page is ready for them).
4. **Live payments** — connect your real Razorpay account.
5. **Order emails** — automatic confirmation emails to customers.
6. **Final details** — change the admin password, add your real contact details, shipping/return
   policy text, and any legal pages.

---

## 9. Need a change?

Anything on the site — products, prices, shipping rates, the WhatsApp number, colours, text, new
features — can be updated. Just share what you'd like and it can be done.

---

*Note: The spiritual benefits described on the website are based on traditional belief and are not
medical claims.*

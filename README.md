# Rewago Dynamic Storefront + Admin

This project now includes:
- React Router based routes (`/`, `/login`, `/signup`, `/admin`)
- Firebase Realtime Database integration for all visible homepage data
- Firebase Authentication (signup/login/logout)
- Admin route to manage hero + dynamic sections and full JSON

## 1) Setup

1. Copy `.env.example` to `.env`.
2. Put your Firebase web app keys in `.env`.
3. Keep database URL as:
   - `https://mantrickweb-default-rtdb.firebaseio.com/`
4. Install and run:
   - `npm install`
   - `npm start`

## 2) Firebase Authentication

In Firebase Console:
1. Open **Authentication**.
2. Enable **Email/Password** sign-in method.
3. Use `/signup` to create users.

## 3) Make Admin User

By default every signup user gets role `user`.

To make admin:
1. Open Realtime Database.
2. Find `users/<uid>/role`.
3. Change value to `admin`.
4. Login again and open `/admin`.

## 4) Data Structure in Realtime Database

Main node used by app:
- `siteData`
  - `menu`
  - `hero`
  - `sections.trending`
  - `sections.brands`
  - `sections.faq`
  - `sellerBanner`

Admin page lets you:
- update hero section
- add items into trending/brands/faq
- edit full JSON for all sections

## 5) Free Image Hosting (recommended)

Use any free image CDN and store URL inside Realtime DB:
- [Cloudinary](https://cloudinary.com/) (free tier, transformations, stable CDN URL)
- [ImageKit](https://imagekit.io/) (free tier, optimization)
- [ImgBB](https://imgbb.com/) (very simple upload + direct URL)

### Process
1. Upload image to one of the above platforms.
2. Copy final image URL (should end with image path or include secure CDN URL).
3. Paste URL in admin form (`Image URL`) or JSON editor.
4. Save; homepage updates from Realtime DB.

## 6) Security Rules (starter)

Use rules similar to this and tighten later:

```json
{
  "rules": {
    "siteData": {
      ".read": true,
      ".write": "auth != null"
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

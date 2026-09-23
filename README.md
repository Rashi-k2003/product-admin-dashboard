# Product Admin Dashboard

A small admin dashboard to manage products, built with Next.js, React, Tailwind CSS, and Axios, using the DummyJSON API.

## Setup
1. `git clone https://github.com/Rashi-k2003/product-admin-dashboard.git`
2. `cd product-admin-dashboard`
3. `npm install`
4. `npm run dev`
5. Open `http://localhost:3000`
6. Log in with username `emilys` and password `emilyspass`

## What's finished
- Login with DummyJSON auth, token stored in localStorage, protected routes, logout
- Product list: responsive table (desktop) and card (mobile) views
- Pagination with page numbers, Previous/Next, page-size selector (10/20/50), and "Showing X–Y of Z" text
- Debounced search with request cancellation (no stale results even when typing fast)
- Category filter and sort by price/rating/title
- Page, search, filter, and sort state synced to the URL — refreshing or sharing the link shows the same result
- Product details page with a "not found" state for invalid ids
- Add/edit forms with validation, delete with a confirm modal
- Loading, empty, and error (with retry) states throughout
- Guards against invalid URL values (e.g. `?page=abc`) and rapid double-submit on login and save

## My approach and notes
- **Search vs. category filter**: DummyJSON can't search and filter by category at the same time, so search takes priority — the category dropdown disables itself while a search query is active, with a short note shown to the user explaining why.
- **Add/edit/delete persistence**: DummyJSON's write endpoints don't actually persist changes server-side. The app reflects each change in local state immediately after a successful API call, so the flow is fully demonstrable even though a page refresh would revert it.
- **One problem I faced and how I fixed it**: [Rashi — fill this in with your own words, e.g. the debounce/race-condition issue or the search/category conflict, and what your actual fix was]
- **Where AI helped**: I used Claude to help scaffold the shared Axios instance, the debounce hook, and the URL-param syncing pattern, then reviewed, tested, and adapted every file myself.
# Howdy

## This is the plan to implement the Front End User Store

- AC:
  - User store created that holds data related to the currently authenticated user
  - Method provided that allows for the fetching/refresh of the user
  - Context provided for the current state of the store (e.g., loading)
  - Fetch added to the app so the user is retrieved on load
  - Navbar updated to fade contents in AFTER user fetch has completed (success or failure)
  - Unit tests covering store
- Notes:
  - Use the `User` type from the shared package
  - Use Zustand for the store
  - Add a fetch call to the root of the application so the user is fetched when the app initially loads

### This file will be deleted

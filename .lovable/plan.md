# Ads and StudyReady Access

## Build
- Add the supplied 728×90 placement and native banner to the game directory, with responsive containers that fit smaller screens.
- Add `/studyready` in the existing Cool G@mes visual style with a code entry form and clear success, invalid, and expired states.
- Generate 100 access codes and store only secure code hashes.
- On a code's first successful redemption, start its 25-day lifetime. The same code can be reused during that window; after 25 days it is permanently expired.
- Remember an authorized browser so ads stay hidden across visits until that code expires.
- Hide both ads for authorized visitors without changing the game library or player layout.

## Technical details
- Enable Lovable Cloud for server-validated code redemption and expiration.
- Add a protected access-code table with explicit grants and row-level security; visitors never receive the code list or hashes.
- Redeem codes through a server function and use a signed, expiring browser token for ad-free status.
- Keep third-party ad scripts client-only to avoid page rendering issues.
- Add unique metadata for `/studyready` and verify the ad-supported and ad-free flows on phone and desktop.

## Deliverable
- Provide the 100 generated plaintext codes once, as a downloadable text file for the site owner.

# Pictures of the places

Painted with Gemini for this game, one picture per place, with no cat in
it: the player's cat is put in front (see "scene" in stories.js).
640 px square, WebP.

| File | Made with |
|---|---|
| rabat-*.webp | Gemini |
| tokyo-*.webp | Gemini (tokyo-konbini: the shop logo on the sign painted over) |

To add a place: paint it square, seen at cat height, with people but no
cat, and empty ground in the lower middle where the cat will stand. Save it
here as `<city>-<id>.webp`, add `<id>` to the city's `scenes` in
stories.js, and give the events that happen there `scene: "<id>"`.
